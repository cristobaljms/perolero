export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-12 items-start">
        {children}
      </div>
    </div>
  );
}
