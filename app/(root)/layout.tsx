import { redirect } from "next/navigation";

import { Toaster } from "@/components/ui/toaster";

import Sidebar from "@/components/layout/Sidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import Header from "@/components/layout/Header";

import { getCurrentUser } from "@/lib/actions/user.actions";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/login");

  return (
    <main className="h-screen flex">
      <Sidebar {...currentUser} />

      <section className="h-full flex flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="remove-scrollbar min-w-0 h-full flex-1 overflow-auto bg-gray-100 rounded-[10px] px-[30px] py-[35px] max-md:py-[15px] max-md:pb-[20px] max-md:px-[10px] mx-[20px] max-sm:mx-0">
          {children}
        </div>
      </section>

      <Toaster />
    </main>
  );
};
export default Layout;
