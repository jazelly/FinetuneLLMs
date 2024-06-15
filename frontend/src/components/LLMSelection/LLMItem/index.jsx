export default function LLMItem({
  name,
  value,
  image,
  description,
  checked,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick(value)}
      className={`w-full p-2 rounded-md hover:cursor-pointer hover:bg-white/10 ${
        checked ? 'bg-white/10' : ''
      }`}
    >
      <input
        type="checkbox"
        value={value}
        className="peer hidden"
        checked={checked}
        readOnly={true}
        formNoValidate={true}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src={image}
          alt={`${name} logo`}
          className="w-10 h-10 rounded-md"
        />
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="mt-1 text-xs text-[#D2D5DB]">{description}</div>
        </div>
      </div>
    </div>
  );
}
