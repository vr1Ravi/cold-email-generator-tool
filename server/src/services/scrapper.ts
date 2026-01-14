import puppeteer, { Browser, Page } from "puppeteer";

class WebScraper {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  async scrapeCompanyInfo(url: string): Promise<{
    title: string;
    description: string;
    content: string;
  }> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const data = await page.evaluate(() => {
        const title = document.title;
        const description =
          document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
        const content = document.body.innerText.substring(0, 2000); // First 2000 chars

        return { title, description, content };
      });

      return data;
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export const scraper = new WebScraper();