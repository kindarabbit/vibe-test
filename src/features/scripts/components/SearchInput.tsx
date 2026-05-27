type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div>
      <label className="sr-only" htmlFor="script-search">
        대본 검색
      </label>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-[15px] outline-none transition placeholder:text-slate-400 focus:border-mint focus:ring-2 focus:ring-mint/20 sm:w-64"
        id="script-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="제목 또는 키워드 검색"
        type="search"
        value={value}
      />
    </div>
  );
}
