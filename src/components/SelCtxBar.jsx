import { useState } from "react";
import { IBtn, VDivider, ColorCol } from "./PenStrip.jsx";
import { Crop, FlipHorizontal2, FlipVertical2 } from "lucide-react";

export default function SelCtxBar({ selType, penColor, drawWidth, drawOpacity, imgOpacity,
    textFont, textSize, textColor, actionsRef, isCropping, onCrop, onCropCancel,
    onPenColor, onDrawWidth, onDrawOpacity, onImgOpacity,
    onTextFont, onTextSize, onTextColor }) {

  if (!selType) return null;
  const apply = props => actionsRef.current?.applyToSelected(props);
  const [customSize, setCustomSize] = useState(null);

  const FONTS = [
    { label:"Serif", value:"Libre Baskerville, serif" },
    { label:"Mono",  value:"Inter, sans-serif" },
    { label:"Sans",  value:"system-ui, sans-serif" },
  ];

  const SIZE_PRESETS = [
    { label:"S",  value:12 },
    { label:"M",  value:18 },
    { label:"L",  value:28 },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 5px", gap:3 }}>

      {selType==="drawing" && <>
        {[{s:1,d:6},{s:2,d:9},{s:4,d:13},{s:8,d:18}].map(({s,d})=>(
          <div key={s} onClick={()=>{ onDrawWidth(s); apply({strokeWidth:s}); }} title={`Stroke ${s}`}
            style={{ width:d, height:d, borderRadius:"50%", background:"var(--navy)", cursor:"pointer",
              opacity:drawWidth===s?1:0.2, transition:"opacity 0.12s,transform 0.1s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
        ))}

        <VDivider />

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <input type="range" min={0} max={1} step={0.05} value={drawOpacity}
            onChange={e=>{ const v=parseFloat(e.target.value); onDrawOpacity(v); apply({opacity:v}); }}
            style={{ writingMode:"vertical-lr", direction:"rtl", width:4, height:60,
              accentColor:"var(--periwinkle)", cursor:"pointer", appearance:"slider-vertical" }} />
          <span style={{ fontSize:8, color:"var(--periwinkle)" }}>{Math.round(drawOpacity*100)}%</span>
        </div>

        <VDivider />
        <ColorCol value={penColor} onChange={c=>{ onPenColor(c); apply({stroke:c}); }} />
      </>}

      {selType==="image" && <>
        <IBtn active={isCropping} onClick={onCrop} title={isCropping ? "Apply crop" : "Crop image"}>
          <Crop size={14} />
        </IBtn>
        <IBtn onClick={() => actionsRef.current?.flipH()} title="Flip horizontal">
          <FlipHorizontal2 size={14} />
        </IBtn>
        <IBtn onClick={() => actionsRef.current?.flipV()} title="Flip vertical">
          <FlipVertical2 size={14} />
        </IBtn>

        <VDivider />

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <input type="range" min={0} max={1} step={0.05} value={imgOpacity}
            onChange={e=>{ const v=parseFloat(e.target.value); onImgOpacity(v); apply({opacity:v}); }}
            style={{ writingMode:"vertical-lr", direction:"rtl", width:4, height:60,
              accentColor:"var(--periwinkle)", cursor:"pointer", appearance:"slider-vertical" }} />
          <span style={{ fontSize:8, color:"var(--periwinkle)" }}>{Math.round(imgOpacity*100)}%</span>
        </div>
      </>}

      {selType==="text" && <>
        {FONTS.map(f=>(
          <IBtn key={f.value} active={textFont===f.value}
            onClick={()=>{ onTextFont(f.value); apply({fontFamily:f.value}); }}
            title={f.label}
            style={{ fontFamily:f.value, fontWeight: f.value.includes("Garamond") ? 600 : 500,
              fontSize:12, width:34, height:34, letterSpacing:"0.01em" }}>
            Aa
          </IBtn>
        ))}

        <VDivider />

        {SIZE_PRESETS.map(({label,value})=>(
          <IBtn key={value} active={customSize===null && textSize===value}
            onClick={()=>{ setCustomSize(null); onTextSize(value); apply({fontSize:value}); }}
            title={`${label} (${value}pt)`}
            style={{ fontSize:9, fontWeight:600, letterSpacing:"0.05em", width:34, height:28 }}>
            {label}
          </IBtn>
        ))}

        <style>{`input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}`}</style>
        <div style={{ marginTop:2, width:34 }}>
          <input
            type="number" min={6} max={200}
            value={customSize !== null ? customSize : textSize}
            onFocus={()=>setCustomSize(textSize)}
            onChange={e=>{ const v=parseInt(e.target.value)||12; setCustomSize(v); onTextSize(v); apply({fontSize:v}); }}
            onBlur={()=>setCustomSize(null)}
            style={{ width:"100%", padding:"3px 4px", fontSize:9, textAlign:"center",
              border:"1px solid rgba(186,189,226,0.5)", borderRadius:0, background:"transparent",
              color:"var(--navy)", outline:"none", fontFamily:"'Inter',sans-serif",
              MozAppearance:"textfield", appearance:"textfield" }}
          />
        </div>

        <VDivider />
        <ColorCol value={textColor} onChange={c=>{ onTextColor(c); apply({fill:c}); }} />
      </>}
    </div>
  );
}
