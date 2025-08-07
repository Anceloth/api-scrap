import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { WebScrapingPort, ScrapingResult, ScrapedLink } from '../../application/ports/web-scraping.port';

@Injectable()
export class CheerioWebScrapingAdapter implements WebScrapingPort {
  async scrapeUrl(url: string): Promise<ScrapingResult> {
    try {
      // Fetch the HTML content
      const response = await axios.get(url, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      // Extract page title
      const title = $('title').text().trim() || 'Untitled Page';

      // Extract all links
      const links: ScrapedLink[] = [];
      $('a[href]').each((index, element) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim();
        
        if (href && text) {
          // Convert relative URLs to absolute URLs
          let absoluteUrl: string;
          try {
            absoluteUrl = new URL(href, url).toString();
          } catch {
            // If URL parsing fails, skip this link
            return;
          }

          // Only include HTTP/HTTPS links and avoid duplicates
          if (absoluteUrl.startsWith('http') && 
              !links.some(link => link.link === absoluteUrl)) {
            links.push({
              link: absoluteUrl,
              name: text.substring(0, 255), // Limit name to 255 characters
            });
          }
        }
      });

      return {
        title: title.substring(0, 255), // Limit title to 255 characters
        links,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }
}
