import React from "react";
import "./Sections.css";

export default function About() {
  return (
    <section id="about" className="site-section">
      <div className="container">
        <h2 className="section-title">About IWMI</h2>
        <p style={{ maxWidth: 900, margin: "8px auto 30px", color: "#cfeff3", lineHeight: 1.7 }}>
          The International Water Management Institute (IWMI) focuses on water security,
          sustainable agriculture, and climate-resilient development. Our mission is to 
          improve water and land management for food security, nature, and communities.
        </p>

        <div className="goals-grid">
          <GoalCard
            img="https://tse4.mm.bing.net/th/id/OIP.dSsfYX0jSnSAj-8pmngNGQHaD5?rs=1&pid=ImgDetMain&o=7&rm=3"
            title="Water Security"
            desc="Efficient, equitable and resilient water management for people and ecosystems."
          />
          <GoalCard
            img='https://th.bing.com/th/id/OIP.xLAmvOhMmtxdWI9zcvHDUgHaE6?w=256&h=180&c=7&r=0&o=7&pid=1.7&rm=3'
            title="Climate-Resilient Agriculture"
            desc="Tools and practices that help farmers adapt to climate variability."
          />
          <GoalCard
            img="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&w=800&q=60"
            title="Sustainable Ecosystems"
            desc="Protecting biodiversity while ensuring livelihoods and food systems."
          />
          <GoalCard
            img="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&w=800&q=60"
            title="Innovation & Research"
            desc="World-class research and data tools for better policy and decision-making."
          />
        </div>
      </div>
    </section>
  );
}

function GoalCard({ img, title, desc }) {
  return (
    <div className="goal-card" onClick={() => window.alert(title)}>
      <div className="goal-img-wrap"><img src={img} alt={title} /></div>
      <h3 className="goal-title">{title}</h3>
      <p className="goal-desc">{desc}</p>
    </div>
  );
}
