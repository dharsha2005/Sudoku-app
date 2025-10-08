import React from 'react';

const sudokuTypes = [
    {
        id: 'mini',
        name: '4×4 Mini',
        description: 'Perfect for beginners',
        size: 4,
        regions: 2
    },
    {
        id: 'six',
        name: '6×6 Sudoku',
        description: 'Intermediate challenge',
        size: 6,
        regions: 6,
        regionRows: 2,
        regionCols: 3
    },
    {
        id: 'classic',
        name: '9×9 Classic',
        description: 'Traditional Sudoku',
        size: 9,
        regions: 3
    },
    {
        id: 'samurai',
        name: 'Samurai Mode',
        description: 'Expert level',
        size: 21,
        isSamurai: true
    }
];

function SudokuTypeSelector({ onSelect, selectedType }) {
    return (
        <div className="sudoku-type-selector">
            <h3>🎮 Select Sudoku Type</h3>
            <div className="sudoku-types">
                {sudokuTypes.map((type) => (
                    <button
                        key={type.id}
                        className={`sudoku-type-btn ${selectedType === type.id ? 'active' : ''}`}
                        onClick={() => onSelect(type)}
                    >
                        <div className="type-name">{type.name}</div>
                        <div className="type-desc">{type.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export { SudokuTypeSelector, sudokuTypes };

export default SudokuTypeSelector;
