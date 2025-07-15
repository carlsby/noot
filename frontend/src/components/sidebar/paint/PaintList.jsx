import PaintItem from "./PaintItem";

export default function PaintList({
  paintings,
  selectedPainting,
  setSelectedPainting,
  updatePainting
}) {
  paintings.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="flex-1 overflow-y-auto mb-4 h-full">
      <ul className="">
        {paintings.map((painting) => (
          <li key={painting._id} className="group">
            <PaintItem
              painting={painting}
              selectedPainting={selectedPainting}
              setSelectedPainting={setSelectedPainting}
              updatePainting={updatePainting}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
