import PropTypes from 'prop-types';

const AdminSearch = ({ nhiSearchTerm, setNhiSearchTerm, onSearch }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <input
        type="text"
        placeholder="Search NHI Number"
        value={nhiSearchTerm}
        onChange={(e) => setNhiSearchTerm(e.target.value)}
        className="border border-gray-300 rounded p-2"
      />
      <button onClick={onSearch} className="bg-blue-500 text-white py-2 px-4 rounded">
        Search
      </button>
    </div>
  );
};

AdminSearch.propTypes = {
  nhiSearchTerm: PropTypes.string.isRequired,
  setNhiSearchTerm: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default AdminSearch;
