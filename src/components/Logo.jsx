import img from '../assets/1751548345_new_загруженное (22).jpg'

function Logo({
  width = "100px"
}) {
  return (
  <div style={{ width }}>
    <img src={img} alt="IMG" style={{ width: "100%", height: "auto", display: "block" }} />
  </div>
  )
}

export default Logo