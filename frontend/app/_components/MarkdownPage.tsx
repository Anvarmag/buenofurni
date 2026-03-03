import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export default async function MarkdownPage({ fileName }: { fileName: string }) {
    let fileContent = '';
    try {
        const filePath = path.join(process.cwd(), '..', 'pages', fileName);
        fileContent = await fs.readFile(filePath, 'utf8');
    } catch {
        notFound();
    }

    // Удаляем YAML Frontmatter (блок между ---), учитывая Windows \r\n
    const contentWithoutFrontmatter = fileContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

    return (
        <article className="prose prose-neutral max-w-[900px] w-full mx-auto py-8 sm:py-12 px-4 sm:px-0 lg:prose-lg break-words marker:text-[var(--accent)] prose-headings:font-bold prose-a:text-[var(--accent)] hover:prose-a:opacity-80 prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentWithoutFrontmatter}
            </ReactMarkdown>
        </article>
    );
}
