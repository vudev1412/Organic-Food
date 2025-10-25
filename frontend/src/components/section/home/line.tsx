import natural from "../../../assets/svg/natural.svg";
import organic from "../../../assets/svg/organic.svg";
import healthy from "../../../assets/svg/healthy.svg";
import natural1 from "../../../assets/svg/natural1.svg";
const LineHome = () => {
  return (
    <section className="line-home flex gap-[100px] p-[20px] justify-between items-center px-[40px]">
      <div className="image-line-home">
        <img src={natural} alt="" />
      </div>
      <div className="image-line-home">
        <img src={organic} alt="" />
      </div>
      <div className="image-line-home">
        <img src={healthy} alt="" />
      </div>
      <div className="image-line-home">
        <img src={natural1} alt="" />
      </div>
    </section>
  );
};

export default LineHome;
