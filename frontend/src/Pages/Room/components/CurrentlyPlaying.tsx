import { Link } from "react-router-dom"

const CurrentlyPlaying = () => {
  return (
    <div
    className=" absolute top-0 w-full  p-4 bg-green-500/30 z-10  backdrop-blur-sm "
    >
        <div className="flex gap-3">
            <img src="/Agneepath.jpg" alt="album" className="rounded-full size-7 animate-spin " />
            <Link to='song/4234' className="flex flex-col ">
            <p className="text-emerald-100 font-bold ">Abhi Mujhme kahi</p> 
            <p className="text-emerald-50 text-xs">Sonu nigam</p>

            </Link>
            <div>

            </div>
        </div>
    </div>
  )
}

export default CurrentlyPlaying