/* ---------------------------------------------------------------------
   SMALL DECOR: kente-inspired divider strip (signature motif)
--------------------------------------------------------------------- */
export function WovenRule({ c }) {
  const teeth = new Array(24).fill(0);
  return (
    <div style={{ display: "flex", height: 6, width: "100%", overflow: "hidden", opacity: 0.55 }}>
      {teeth.map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: "100%",
            background: i % 3 === 0 ? c.clay : i % 3 === 1 ? c.gold : c.primary,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            marginRight: 1,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}
