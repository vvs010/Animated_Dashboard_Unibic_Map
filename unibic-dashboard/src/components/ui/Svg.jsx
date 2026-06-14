import React from 'react';

export default function Svg({ vb, children, style }) { 
  return <svg viewBox={vb} width="100%" style={style}>{children}</svg>; 
}