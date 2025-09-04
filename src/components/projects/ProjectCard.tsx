import Link from "next/link";
import Image from "next/image";

export type ProjectCardProps = {
  slug: string;
  title: string;
  date?: string;
  stack?: string[];
  summary?: string;
  hero?: string | null;
};

export default function ProjectCard({
  slug,
  title,
  date,
  stack = [],
  summary,
  hero = null,
}: ProjectCardProps) {
  return (
    <article
      data-testid={`project-card-${slug}`}
      className="group rounded-lg overflow-hidden border border-brand-200/10 bg-surface-50 transition-all hover:bg-surface-100 hover:border-brand-200/20"
    >
      <Link href={`/projects/${slug}`} className="block">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-brand-800">
          {hero ? (
            <Image
              src={hero}
              alt={`${title} screenshot`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-opacity duration-300 group-hover:opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-200">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-brand-100 group-hover:text-brand-50 transition-colors">
            {title}
          </h3>

          {summary ? (
            <p className="text-sm text-brand-200 mb-4 line-clamp-3">{summary}</p>
          ) : null}

          <div className="flex flex-wrap gap-2 items-center justify-between text-xs">
            <div className="text-brand-200">{date ?? null}</div>
            <div className="flex flex-wrap gap-1">
              {stack.map((tech) => (
                <span key={tech} className="px-2 py-1 rounded-full bg-surface-100 text-brand-100">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
