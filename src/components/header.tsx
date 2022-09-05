function Header() {
  return (
    <div className="flex flex-col items-center pt-4 m-auto sm:w-[500px] md:w-auto">
      <h1 className="text-3xl pt-4">Anything Blog </h1>
      <p className="mt-4 text-lg">
        Made with{" "}
        <a className="underline" href="https://create.t3.gg/">
          create-t3-app
        </a>
      </p>
    </div>
  );
}
export default Header;
