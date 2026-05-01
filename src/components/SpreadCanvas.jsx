import { useEffect, useRef } from "react";
import useFabricLib from "../hooks/useFabricLib.js";

function generatePatternDataUrl(templateId, bg, W, H) {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg || "#fffffe";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(186,189,226,0.6)";
  ctx.lineWidth = 1;
  if (templateId === "dot") {
    ctx.fillStyle = "rgba(186,189,226,0.7)";
    for (let x = 20; x < W; x += 20)
      for (let y = 20; y < H; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
      }
  } else if (templateId === "grid") {
    for (let x = 0; x <= W; x += 24) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 24) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  } else if (templateId === "lined") {
    for (let y = 28; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }
  return c.toDataURL();
}

export default function SpreadCanvas({ spread, editMode, actionsRef, onSelect, onToolReset }) {
  const wrapRef      = useRef(null);
  const canvasEl     = useRef(null);
  const fc           = useRef(null);
  const histRef      = useRef([]);
  const histPos      = useRef(-1);
  const fabricLib    = useRef(null);
  const onSelectRef  = useRef(onSelect);
  const onToolRstRef = useRef(onToolReset);
  const pageColorRef = useRef(spread.pageColor || "#fffffe");

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onToolRstRef.current = onToolReset; }, [onToolReset]);
  useEffect(() => { pageColorRef.current = spread.pageColor || "#fffffe"; }, [spread.pageColor]);

  const snapshot = () => {
    if (!fc.current) return;
    const json = JSON.stringify(fc.current.toJSON(["isTemplate"]));
    histRef.current = histRef.current.slice(0, histPos.current + 1).concat(json);
    histPos.current = histRef.current.length - 1;
  };

  const loadTemplateImg = (canvas, fabric, dataUrl, W, H) => {
    fabric.Image.fromURL(dataUrl, img => {
      img.scaleX = W / img.width;
      img.scaleY = H / img.height;
      img.set({ left:0, top:0, selectable:false, evented:false, hoverCursor:"default",
        lockMovementX:true, lockMovementY:true });
      img.isTemplate = true;
      canvas.add(img); canvas.sendToBack(img); canvas.renderAll(); snapshot();
    });
  };

  useFabricLib(fabric => {
    if (fc.current) return;
    const wrap = wrapRef.current;
    const canvasElement = canvasEl.current;
    if (!wrap || !canvasElement) return;

    const W = 880;
const H = 580;
    if (W <= 0 || H <= 0) return; // Wait for proper sizing

    fabricLib.current = fabric;

    const canvas = new fabric.Canvas(canvasElement, {
      width: W, height: H,
      backgroundColor: spread.pageColor || "#fffffe",
      selection: editMode,
      isDrawingMode: false,
      preserveObjectStacking: true,
    });
    canvas.setDimensions({ width: "100%", height: "100%" }, { cssOnly: true });

    fabric.Object.prototype.set({
      cornerColor:"#374375", cornerSize:8, cornerStyle:"circle",
      borderColor:"#374375", borderDashArray:[4,3], transparentCorners:false,
    });

    fc.current = canvas;
    window._fabricCanvas = canvas;

    const canvasJSON = spread.canvas || spread.canvasJSON;
    const templateId = spread.template_id || spread.templateId;
    const templateImage = spread.template_image || spread.templateImage;

    if (canvasJSON) {
      canvas.loadFromJSON(canvasJSON, () => { canvas.renderAll(); snapshot(); });
    } else if (templateImage) {
      loadTemplateImg(canvas, fabric, templateImage, W, H);
    } else if (templateId && templateId !== "blank") {
      const normalizedId = templateId.toLowerCase();
      const kind = normalizedId.startsWith("dotted") ? "dot"
        : normalizedId.startsWith("grid") ? "grid"
        : normalizedId.startsWith("lined") ? "lined"
        : null;
      if (kind) {
        const dataUrl = generatePatternDataUrl(kind, spread.pageColor, W, H);
        loadTemplateImg(canvas, fabric, dataUrl, W, H);
      } else {
        canvas.renderAll(); snapshot();
      }
    } else {
      canvas.renderAll(); snapshot();
    }

    ["object:added","object:modified","object:removed","path:created"].forEach(ev =>
      canvas.on(ev, () => { if (!canvas._noSnap) snapshot(); })
    );

    canvas.on("path:created", e => {
      if (canvas._eraserMode && e.path) {
        e.path.set({ stroke:pageColorRef.current, selectable:false, evented:false, hoverCursor:"default" });
        e.path.isEraserStroke = true;
        canvas.renderAll();
      }
    });

    const notify = () => {
      const obj = canvas.getActiveObject();
      if (obj && obj._isCropRect) return;
      if (onSelectRef.current) onSelectRef.current(obj || null);
    };
    canvas.on("selection:created", notify);
    canvas.on("selection:updated", notify);
    canvas.on("selection:cleared", () => {
      if (canvas._cropRect) return;
      if (onSelectRef.current) onSelectRef.current(null);
    });
  });

  useEffect(() => {
    if (!fc.current) return;
    const canvas = fc.current;
    canvas.isDrawingMode = false;
    canvas.selection = editMode;
    canvas.getObjects().forEach(o => {
      if (!o.isTemplate) {
        o.selectable  = editMode;
        o.evented     = editMode;
        o.hoverCursor = editMode ? "move" : "default";
      }
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    if (!editMode) canvas.off("mouse:down");
  }, [editMode]);

  useEffect(() => {
    if (!fc.current) return;
    fc.current.setBackgroundColor(spread.pageColor || "#fffffe", fc.current.renderAll.bind(fc.current));
  }, [spread.pageColor]);

  useEffect(() => {
    if (!actionsRef) return;
    const restoreTemplates = () => {
      fc.current.getObjects().forEach(o => {
        if (o.isTemplate) {
          o.set({ selectable:false, evented:false, hoverCursor:"default" });
          fc.current.sendToBack(o);
        }
      });
    };

    actionsRef.current = {
      undo() {
        if (!fc.current || histPos.current <= 0) return;
        histPos.current--;
        fc.current._noSnap = true;
        fc.current.loadFromJSON(histRef.current[histPos.current], () => {
          fc.current._noSnap = false;
          fc.current.setBackgroundColor(spread.pageColor||"#fffffe", () => {
            restoreTemplates(); fc.current.renderAll();
          });
        });
      },
      redo() {
        if (!fc.current || histPos.current >= histRef.current.length-1) return;
        histPos.current++;
        fc.current._noSnap = true;
        fc.current.loadFromJSON(histRef.current[histPos.current], () => {
          fc.current._noSnap = false;
          fc.current.setBackgroundColor(spread.pageColor||"#fffffe", () => {
            restoreTemplates(); fc.current.renderAll();
          });
        });
      },
      save() {
        if (!fc.current) return null;
        return JSON.stringify(fc.current.toJSON(["isTemplate"]));
      },
      deleteSelected() {
        if (!fc.current) return;
        const obj = fc.current.getActiveObject();
        if (!obj) return;
        if (obj.type==="activeSelection") obj.forEachObject(o => { if(!o.isTemplate&&!o._isCropRect) fc.current.remove(o); });
        else if (!obj.isTemplate && !obj._isCropRect) fc.current.remove(obj);
        fc.current.discardActiveObject(); fc.current.renderAll(); snapshot();
        if (onSelectRef.current) onSelectRef.current(null);
      },
      applyToSelected(props) {
        const canvas = fc.current; if (!canvas) return;
        const obj = canvas.getActiveObject(); if (!obj || obj.isTemplate) return;
        obj.set(props); canvas.renderAll(); snapshot();
      },
      bringToFront() {
        const canvas = fc.current; if (!canvas) return;
        const obj = canvas.getActiveObject(); if (!obj||obj.isTemplate) return;
        canvas.bringForward(obj, true); canvas.discardActiveObject(); canvas.setActiveObject(obj); canvas.requestRenderAll(); snapshot();
      },
      sendToBack() {
        const canvas = fc.current; if (!canvas) return;
        const obj = canvas.getActiveObject(); if (!obj||obj.isTemplate) return;
        canvas.sendBackwards(obj, true);
        const objs = canvas.getObjects();
        const idx = objs.indexOf(obj);
        const lastTemplate = objs.reduce((acc, o, i) => o.isTemplate ? i : acc, -1);
        if (idx <= lastTemplate) canvas.bringForward(obj, true);
        canvas.discardActiveObject(); canvas.setActiveObject(obj); canvas.requestRenderAll(); snapshot();
      },
      flipH() {
        const canvas = fc.current; if (!canvas) return;
        const obj = canvas.getActiveObject(); if (obj) { obj.set("flipX",!obj.flipX); canvas.renderAll(); snapshot(); }
      },
      flipV() {
        const canvas = fc.current; if (!canvas) return;
        const obj = canvas.getActiveObject(); if (obj) { obj.set("flipY",!obj.flipY); canvas.renderAll(); snapshot(); }
      },
      cropImage() {
        const canvas = fc.current; const fabric = fabricLib.current;
        if (!canvas || !fabric) return;

        if (canvas._cropState) {
          const { img, dimRects, cropHandle } = canvas._cropState;
          const hL  = cropHandle.left;
          const hT  = cropHandle.top;
          const hW  = cropHandle.getScaledWidth();
          const hH  = cropHandle.getScaledHeight();
          const iSX = img.scaleX || 1;
          const iSY = img.scaleY || 1;
          const offX = (hL - img.left) / iSX;
          const offY = (hT - img.top)  / iSY;
          const newW = hW / iSX;
          const newH = hH / iSY;
          const natW = img._element?.naturalWidth  || img.width;
          const natH = img._element?.naturalHeight || img.height;
          const srcX = Math.max(0, Math.min((img.cropX || 0) + offX, natW - 1));
          const srcY = Math.max(0, Math.min((img.cropY || 0) + offY, natH - 1));
          const srcW = Math.max(1, Math.min(newW, natW - srcX));
          const srcH = Math.max(1, Math.min(newH, natH - srcY));

          dimRects.forEach(r => canvas.remove(r));
          canvas.remove(cropHandle);
          canvas._cropState = null;

          img.set({
            cropX: srcX, cropY: srcY,
            width: Math.round(srcW), height: Math.round(srcH),
            left: hL, top: hT,
            selectable: true, evented: true, hoverCursor: "move",
          });
          canvas.setActiveObject(img);
          canvas.renderAll();
          snapshot();
          if (onSelectRef.current) onSelectRef.current(img);
          return;
        }

        const img = canvas.getActiveObject();
        if (!img || img.type !== "image") return;

        const iW = img.getScaledWidth();
        const iH = img.getScaledHeight();
        const iL = img.left;
        const iT = img.top;
        const cW = canvas.width;
        const cH = canvas.height;

        img.set({ selectable: false, evented: false, hoverCursor: "default" });

        const dimStyle = { fill:"rgba(0,0,0,0.5)", selectable:false, evented:false, excludeFromExport:true };
        const dimTop    = new fabric.Rect({ ...dimStyle, left:0,    top:0,     width:cW, height:iT });
        const dimBottom = new fabric.Rect({ ...dimStyle, left:0,    top:iT+iH, width:cW, height:Math.max(0, cH - iT - iH) });
        const dimLeft   = new fabric.Rect({ ...dimStyle, left:0,    top:iT,    width:iL, height:iH });
        const dimRight  = new fabric.Rect({ ...dimStyle, left:iL+iW, top:iT,   width:Math.max(0, cW - iL - iW), height:iH });
        const dimRects  = [dimTop, dimBottom, dimLeft, dimRight];
        dimRects.forEach(r => { canvas.add(r); canvas.bringToFront(r); });

        const cropHandle = new fabric.Rect({
          left: iL, top: iT, width: iW, height: iH,
          scaleX: 1, scaleY: 1,
          fill: "transparent",
          stroke: "#ffffff", strokeWidth: 1.5,
          hasRotatingPoint: false, lockRotation: true,
          _isCropRect: true, excludeFromExport: true,
        });

        const updateDim = () => {
          let hL = cropHandle.left, hT = cropHandle.top;
          let hW = Math.max(16, Math.min(cropHandle.getScaledWidth(),  iW));
          let hH = Math.max(16, Math.min(cropHandle.getScaledHeight(), iH));
          hL = Math.max(iL, Math.min(hL, iL + iW - hW));
          hT = Math.max(iT, Math.min(hT, iT + iH - hH));
          cropHandle.set({ left: hL, top: hT, scaleX: hW / cropHandle.width, scaleY: hH / cropHandle.height });
          dimTop.set({    top: 0,     height: hT,                         width: cW });
          dimBottom.set({ top: hT+hH, height: Math.max(0, cH - hT - hH), width: cW });
          dimLeft.set({   top: hT,    height: hH, left: 0,   width: hL });
          dimRight.set({  top: hT,    height: hH, left: hL+hW, width: Math.max(0, cW - hL - hW) });
          canvas.renderAll();
        };

        cropHandle.on("moving",  updateDim);
        cropHandle.on("scaling", updateDim);

        canvas._cropState = { img, dimRects, cropHandle };
        canvas.add(cropHandle);
        canvas.bringToFront(cropHandle);
        canvas.discardActiveObject();
        canvas.setActiveObject(cropHandle);
        canvas.renderAll();
        if (onSelectRef.current) onSelectRef.current(img);
      },
      cancelCrop() {
        const canvas = fc.current; if (!canvas || !canvas._cropState) return;
        const { img, dimRects, cropHandle } = canvas._cropState;
        dimRects.forEach(r => canvas.remove(r));
        canvas.remove(cropHandle);
        canvas._cropState = null;
        img.set({ selectable: true, evented: true, hoverCursor: "move" });
        canvas.setActiveObject(img);
        canvas.renderAll();
        if (onSelectRef.current) onSelectRef.current(img);
      },
      setTool(tool, opts={}) {
        const canvas = fc.current; const fabric = fabricLib.current;
        if (!canvas || !fabric) return;
        canvas.isDrawingMode = false; canvas.off("mouse:down"); canvas.defaultCursor = "default";
        if (tool==="pen") {
          canvas._eraserMode = false;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = opts.color||"#1a1a18";
          canvas.freeDrawingBrush.width = opts.size||2;
          canvas.isDrawingMode = true; canvas.defaultCursor = "crosshair";
        } else if (tool==="eraser") {
          canvas._eraserMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = pageColorRef.current;
          canvas.freeDrawingBrush.width = (opts.size||2)*6;
          canvas.isDrawingMode = true; canvas.defaultCursor = "crosshair";
        } else if (tool==="text") {
          canvas.defaultCursor = "text";
          canvas.on("mouse:down", e => {
            const pt = canvas.getPointer(e.e);
            const txt = new fabric.IText("Type here…", {
              left:pt.x, top:pt.y, fontFamily:"Libre Baskerville,serif",
              fontSize:20, fill:opts.color||"#1a1a18", selectable:true, evented:true,
            });
            canvas.discardActiveObject(); canvas.add(txt); canvas.setActiveObject(txt);
            txt.enterEditing(); txt.selectAll(); canvas.renderAll(); snapshot();
            canvas.off("mouse:down"); canvas.defaultCursor = "default";
            if (onToolRstRef.current) onToolRstRef.current();
          });
        }
      },
      uploadImage() {
        const canvas = fc.current; const fabric = fabricLib.current;
        if (!canvas || !fabric) return;
        const inp = document.createElement("input");
        inp.type="file"; inp.accept="image/jpeg,image/png,image/gif,image/webp";
        inp.onchange = ev => {
          const file = ev.target.files[0]; if (!file) return;
          const r = new FileReader();
          r.onload = re => {
            fabric.Image.fromURL(re.target.result, img => {
              const maxW = canvas.width*0.5;
              if (img.width > maxW) img.scaleToWidth(maxW);
              img.set({
                left:canvas.width/2-(img.width*(img.scaleX||1))/2,
                top: canvas.height/2-(img.height*(img.scaleY||1))/2,
                selectable:true, evented:true,
              });
              canvas.discardActiveObject(); canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); snapshot();
            });
          };
          r.readAsDataURL(file);
        };
        inp.click();
      },
      addImageFromURL(url) {
        const canvas = fc.current; const fabric = fabricLib.current;
        if (!canvas || !fabric) return;
        fabric.Image.fromURL(url, img => {
          if (!img || !img.width) return;
          const maxW = canvas.width * 0.5;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: canvas.width/2 - (img.width*(img.scaleX||1))/2,
            top:  canvas.height/2 - (img.height*(img.scaleY||1))/2,
            selectable:true, evented:true,
          });
          canvas.discardActiveObject(); canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); snapshot();
        }, { crossOrigin: "anonymous" });
      },
      addSticker(emoji) {
        const canvas = fc.current; const fabric = fabricLib.current;
        if (!canvas || !fabric) return;
        const txt = new fabric.Text(emoji, {
          fontSize: 52,
          left: canvas.width/2 - 26,
          top:  canvas.height/2 - 26,
          selectable: true, evented: true,
          hasControls: true, hasBorders: true,
          _isSticker: true,
        });
        txt._isSticker = true;
        canvas.discardActiveObject(); canvas.add(txt); canvas.setActiveObject(txt); canvas.renderAll(); snapshot();
      },
      updateBrush(color, size) {
        const canvas = fc.current; if (!canvas||!canvas.isDrawingMode) return;
        if (canvas._eraserMode) { canvas.freeDrawingBrush.color=pageColorRef.current; canvas.freeDrawingBrush.width=size*6; }
        else { canvas.freeDrawingBrush.color=color; canvas.freeDrawingBrush.width=size; }
      },
    };
  }, [spread, editMode]);

  useEffect(() => () => {
    if (fc.current) { fc.current.dispose(); fc.current=null; window._fabricCanvas=null; }
  }, []);

  return (
    <div ref={wrapRef} style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden",
      pointerEvents: editMode ? "auto" : "none" }}>
      <canvas ref={canvasEl} style={{ position:"relative", zIndex:1 }} />
    </div>
  );
}
