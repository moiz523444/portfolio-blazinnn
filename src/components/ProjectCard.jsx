import React, { useRef, useState } from 'react';
import RollingText from './RollingText';

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  });
  const [imgTransform, setImgTransform] = useState({
    transform: 'scale(1) translate3d(0, 0, 0)',
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    const moveX = ((x - centerX) / centerX) * -12;
    const moveY = ((y - centerY) / centerY) * -12;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    setImgTransform({
      transform: `scale(1.08) translate3d(${moveX}px, ${moveY}px, 0)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
    });
    setImgTransform({
      transform: 'scale(1) translate3d(0, 0, 0)',
      transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
    });
  };

  return (
    <a
      href={project.url || '#'}
      ref={cardRef}
      className="CaseStudiesGrid_card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="project"
      data-cursor-text="VIEW"
      style={transformStyle}
    >
      <div className="CaseStudiesGrid_imageWrapper">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="CaseStudiesGrid_img"
          style={imgTransform}
        />
      </div>
      <h2 className="Text_h6 DashedLabel_labelWrapper">
        <RollingText text={project.name} />
        <span className="DashedLabel_suffixWrapper">
          <span className="DashedLabel_dash"></span>
          <span className="DashedLabel_suffix">{project.category}</span>
        </span>
      </h2>
    </a>
  );
}
