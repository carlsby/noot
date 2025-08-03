import PaintItem from "./PaintItem";

export default function PaintList({
  paintings,
  selectedPainting,
  setSelectedPainting,
  updatePainting,
  deletePainting
}) {
  paintings.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div>
      <ul>
        {paintings.map((painting) => (
          <li key={painting._id} className="group">
            <PaintItem
              painting={painting}
              selectedPainting={selectedPainting}
              setSelectedPainting={setSelectedPainting}
              updatePainting={updatePainting}
              deletePainting={deletePainting}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
