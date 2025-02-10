interface UrlInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
  }
  
  export const UrlInput: React.FC<UrlInputProps> = ({
    value,
    onChange,
    onSubmit,
    disabled
  }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-8">
        <fieldset>
          <legend className="block mb-2 font-medium">
            Enter Website URL(s) (one per line):
          </legend>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[120px]"
            placeholder="https://example.com"
            aria-label="Website URLs"
          />
        </fieldset>
        <button
          type="submit"
          disabled={disabled}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {disabled ? 'Testing...' : 'Test Websites'}
        </button>
      </form>
    );
  };