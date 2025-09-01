import Link from "next/link";

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
      className="rounded-md overflow-hidden border border-muted bg-body"
    >
      <Link href={`/projects/${slug}`} className="block">
        <div className="h-40 w-full mb-3 bg-brand-700 flex items-center justify-center">
          {hero ? (
            <img
              src={hero}
              alt={title + " screenshot"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-1 text-fg">{title}</h3>

          {summary ? (
            <p className="text-sm text-muted mb-2 line-clamp-3">{summary}</p>
          ) : null}

          <div className="flex items-center justify-between text-xs text-muted">
            <div>{date ?? null}</div>
            <div>{stack.length ? stack.join(", ") : null}</div>
          </div>
        </div>
      </Link>
    </article>
  );
}
