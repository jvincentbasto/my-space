import Link from "next/link";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const Logo = () => {
    return (
      <Link href="/" className="text-left ml-[5px]">
        <p className="text-[52px] block max-lg:hidden font-bold text-white">
          <span className="">My</span>
          <span className="inline-block text-blue-400">Space</span>
          <span className="inline-block size-[10px] bg-blue-400 rounded-full"></span>
        </p>
        <p className="text-[30px] hidden max-lg:block font-bold text-white">
          <span className="">M</span>
          <span className="inline-block text-white">S</span>
          <span className="inline-block size-[8px] bg-white rounded-full"></span>
        </p>
      </Link>
    );
  };
  const LogoForm = () => {
    return (
      <Link href="/" className="text-left ml-[5px]">
        <p className="text-[42px] hidden max-lg:block font-bold text-neutral-700">
          <span className="">My</span>
          <span className="inline-block text-blue-400">Space</span>
          <span className="inline-block size-[10px] bg-blue-400 rounded-full"></span>
        </p>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen">
      <section className="w-[50%] min-w-[500px] hidden lg:flex justify-center items-center bg-neutral-800 p-[20px]">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Logo />

          <div className="space-y-5 text-white">
            <h1 className="h1">Organize your files with ease</h1>
            <p className="body-1">
              Efficiently manage and securely store all your documents in one
              place. You’ll always have quick access to your important documents
              whenever you need them.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/assets/images/myspace3.png"
              alt="Files"
              width={342}
              height={342}
              priority
              className="transition-all hover:rotate-2 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="hidden max-lg:block mb-[60px]">
          <LogoForm />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
