import { InfoDialogProps } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

export default function InfoDialog({ open, handleClose }: InfoDialogProps) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "#64748b",
            borderRadius: 20,
            color: "#fff",
          },
        }}>
        <DialogTitle>{"¿Cómo usar?"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#fff" }}>
            ➡️ Ponele el emoji de los guantes (🧤) a quienes van a ser arqueros
            para que aparezcan seleccionados automáticamente.
          </DialogContentText>
          <DialogContentText sx={{ color: "#fff" }}>
            ➡️ Podés agregar 8, 10, 14 o 16 nombres, uno por línea.
          </DialogContentText>
          <DialogContentText sx={{ color: "#fff" }}>
            ➡️ Sólo en los partidos de 16 personas se pueden elegir las
            posiciones.
          </DialogContentText>
          <DialogActions>
            <Button
              className="actionButton"
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "gray",
                "&:hover": {
                  backgroundColor: "gray",
                },
              }}>
              Cerrar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
