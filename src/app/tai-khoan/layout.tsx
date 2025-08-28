import AuthContainer from "@/components/layout/AuthContainer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <AuthContainer>
        {children}
      
    </AuthContainer>
  );
}
