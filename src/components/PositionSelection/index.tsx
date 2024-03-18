import Button from "@mui/material/Button";

type PositionSelectionProps = {
  onNextStep: any;
};

export default function PositionSelection({
  onNextStep,
}: PositionSelectionProps) {
  return (
    <div>
      {/* Your component UI */}
      <Button variant="contained" onClick={onNextStep}>
        Siguiente
      </Button>
    </div>
  );
}
