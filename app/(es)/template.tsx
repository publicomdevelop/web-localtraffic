/** Re-mounts on every navigation: a short curtain wipe marks the change of page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
