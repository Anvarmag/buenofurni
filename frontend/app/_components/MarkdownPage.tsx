import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export default async function MarkdownPage({ fileName }: { fileName: string }) {
    try {
        const filePath = path.join(process.cwd(), '..', 'pages', fileName);
        const fileContent = await fs.readFile(filePath, 'utf8');

        // Удаляем YAML Frontmatter (блок между ---), учитывая Windows \r\n
        const contentWithoutFrontmatter = fileContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

        return (
            <article className="prose prose-neutral max-w-[900px] w-full mx-auto pt-32 pb-12 px-6 lg:prose-lg marker:text-accent prose-headings:font-bold prose-a:text-accent hover:prose-a:text-accent-wood prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contentWithoutFrontmatter}
                </ReactMarkdown>
            </article>
        );
    } catch (error) {
        notFound();
    }
}
