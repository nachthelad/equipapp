import { Button } from '@mui/material';

interface PositionButtonsProps {
  onChange: (position: string) => void;
}

const PositionButtons: React.FC<PositionButtonsProps> = ({ onChange }) => {
  const positions = ['Arq', 'Def', 'Medio', 'Del'];

  return (
    <div>
      {positions.map((position, index) => (
        <Button key={index} onClick={() => onChange(position)} variant="contained" className="filter-switch-item">
          {position}
        </Button>
      ))}
    </div>
  );
};

export default PositionButtons;
