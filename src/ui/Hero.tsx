import { profile } from '../data/profile';

export default function Hero() {
  return (
    <section className="section hero" id="top">
      <div className="wordmark">
        {profile.name}
        <small>{profile.role}</small>
      </div>
      <div className="scroll-hint mono">
        <span>SCROLL</span>
        <span className="bar" />
      </div>
    </section>
  );
}
