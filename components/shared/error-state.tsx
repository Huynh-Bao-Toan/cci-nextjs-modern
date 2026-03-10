type ErrorStateProps = {
  title?: string;
  description?: string;
  retryAction?: React.ReactNode;
};

export function ErrorState({
  title = "Something went wrong.",
  description,
  retryAction,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <h3 className="text-sm font-semibold text-destructive">{title}</h3>
      {description ? (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      ) : null}
      {retryAction ? <div className="mt-1">{retryAction}</div> : null}
    </div>
  );
}

