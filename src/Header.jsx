import metrologo from "./assets/metrologo.png"

const Header = () => {
  return (
    <header className="w-full h-[180px] px-10 flex justify-between bg-cyan-800 text-mist-100 items-center shadow-xl box-border">

      <h1 className="text-[54px] font-bold">
        Bem vindo ao MetroMap!
      </h1>

      <img
        src={metrologo}
        alt="Logo Metro"
        className="w-[110px] h-auto object-contain shrink-0"
      />

    </header>
  )
}

export default Header