import { Button, ButtonGroup } from "@mui/material";

interface CategoryButtonsProps {
  onChange: (category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ onChange }) => {
  return (
    <ButtonGroup variant="contained">
      <Button onClick={() => onChange("A")} className="filter-switch-item">
        A
      </Button>
      <Button onClick={() => onChange("B")} className="filter-switch-item">
        B
      </Button>
    </ButtonGroup>
  );
};

export default CategoryButtons;
