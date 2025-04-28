export default function NewListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-5 py-10 flex justify-center relative">
        {children}
      </div>
    </div>
  );
}
