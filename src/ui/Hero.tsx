/** Hero is just a 100vh scroll spacer — the name is in <Nameplate> (behind the
 * canvas) and the crystal lives in the WebGL scene. */
export default function Hero() {
  return (
    <section className="section hero" id="top">
      <div className="scroll-hint mono">
        <span>SCROLL</span>
        <span className="bar" />
      </div>
    </section>
  );
}
