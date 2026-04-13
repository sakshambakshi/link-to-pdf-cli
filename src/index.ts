#!/usr/bin/env node

import { Command } from 'commander';
import puppeteer, { Browser, Page } from 'puppeteer';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const program = new Command();

program
  .name('link-to-pdf-cli')
  .description('A CLI to convert URLs to PDF files.')
  .version('1.0.0')
  .option('-u, --url <url>', 'Download a single URL as PDF')
  .option('-f, --file <filePath>', 'Path to a txt file containing a list of URLs')
  .option('-o, --output <directory>', 'Output directory for the PDFs (default: current directory)', process.cwd());

// Help is automatically added by commander (-h, --help)

program.parse(process.argv);

interface Options {
  url?: string;
  file?: string;
  output: string;
}

const options = program.opts<Options>();

function validateUrls(urls: string[]): { validUrls: string[], invalidUrls: string[] } {
  const validUrls: string[] = [];
  const invalidUrls: string[] = [];

  for (let url of urls) {
    let checkUrl = url;
    if (!checkUrl.startsWith('http://') && !checkUrl.startsWith('https://')) {
      checkUrl = 'https://' + checkUrl;
    }
    try {
      new URL(checkUrl);
      validUrls.push(checkUrl);
    } catch (e) {
      invalidUrls.push(url);
    }
  }

  return { validUrls, invalidUrls };
}

async function run(): Promise<void> {
  if (!options.url && !options.file) {
    console.error('Error: Please provide either a single URL (-u) or a text file containing URLs (-f).');
    program.help(); // Show the help menu if arguments are missing
    process.exit(1);
  }

  let urls: string[] = [];

  if (options.url) {
    urls.push(options.url);
  }

  if (options.file) {
    try {
      const fileContent: string = readFileSync(options.file, 'utf-8');
      const lines: string[] = fileContent.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
      urls = urls.concat(lines);
    } catch (error: any) {
      console.error(`Error reading file ${options.file}:`, error.message);
      process.exit(1);
    }
  }

  if (urls.length === 0) {
    console.error('No URLs found to process.');
    process.exit(1);
  }

  const { validUrls, invalidUrls } = validateUrls(urls);

  if (invalidUrls.length > 0) {
    console.warn(`\nWarning: The following URLs are invalid and will be skipped:`);
    invalidUrls.forEach(u => console.warn(` - ${u}`));
    console.warn('');
  }

  if (validUrls.length === 0) {
    console.error('Error: No valid URLs found to process.');
    process.exit(1);
  }

  urls = validUrls;

  const outDir: string = resolve(options.output);
  if (!existsSync(outDir)) {
    try {
      mkdirSync(outDir, { recursive: true });
    } catch (error: any) {
      console.error(`Error creating output directory ${outDir}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`Starting PDF conversion for ${urls.length} URL(s)...`);
  console.log(`Output directory: ${outDir}`);

  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({ headless: 'new' as any });
  } catch (error: any) {
    console.error('Error launching browser:', error.message);
    process.exit(1);
  }

  const page: Page = await browser.newPage();

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url: string = urls[i];
    const done = i + 1;
    const left = urls.length - done;

    try {
      console.log(`Processing [${done}/${urls.length}]: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const title: string = await page.title();
      let sanitizedTitle: string = title.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').substring(0, 50);
      if (!sanitizedTitle) sanitizedTitle = `page_${done}`;

      let fileName: string = `${done}_${sanitizedTitle}.pdf`;
      let filePath: string = join(outDir, fileName);
      let dedupeIndex: number = 1;

      while (existsSync(filePath)) {
        fileName = `${done}_${sanitizedTitle}_${dedupeIndex}.pdf`;
        filePath = join(outDir, fileName);
        dedupeIndex++;
      }

      await page.pdf({ path: filePath, format: 'A4', printBackground: true });
      successCount++;
      console.log(`✅ Saved: ${filePath} | [Done: ${done}, Left: ${left}]`);
    } catch (error: any) {
      failureCount++;
      console.error(`❌ Failed to process ${url} | [Done: ${done}, Left: ${left}]:`, error.message);
    }
  }

  await browser.close();
  console.clear();
  console.log('\n--- Finished Processing URLs ---');
  console.log(`Total URLs Provided: ${urls.length + invalidUrls.length}`);
  console.log(`Invalid URLs (Skipped): ${invalidUrls.length}`);
  console.log(`Successfully Downloaded: ${successCount}`);
  console.log(`Failed Downloads: ${failureCount}`);
}

run();
