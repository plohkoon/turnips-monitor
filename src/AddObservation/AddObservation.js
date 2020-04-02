import React, {useState} from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Slider, Input, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

import './styles.css';

import Add from '@material-ui/icons/Add';

function AddObservation(props) {

  let [display, setDisplay] = useState(false);
  let [value, setValue] = useState(200);
  let [name, setName] = useState('');

  function toggleDisplay(){
    setDisplay(!display);
  }

  return (
    <div>
      <Fab variant="extended" onClick={toggleDisplay} className="fab">
        <Add />
        Add Observation
      </Fab>
      <Dialog open={display} onClose={toggleDisplay}>
        <DialogTitle>
          Add Observation
        </DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel id="name-select">Name</InputLabel>
          <Select
            labelId="name-select"
            id="name-select"
            value={name}
            onChange={ev => setName(ev.target.value)}
          >
            <MenuItem value={"TR"}>TR</MenuItem>
            <MenuItem value={"Shelby"}>Shelby</MenuItem>
            <MenuItem value={"Jad"}>Jad</MenuItem>
            <MenuItem value={"Sarah"}>Sarah</MenuItem>
            <MenuItem value={"Dylan"}>Dylan</MenuItem>
            <MenuItem value={"Danica"}>Danica</MenuItem>
            <MenuItem value={"Liam"}>Liam</MenuItem>
            <MenuItem value={"A Aron"}>A Aron</MenuItem>
            <MenuItem value={"Mark"}>Mark</MenuItem>
            <MenuItem value={"Gage"}>Gage</MenuItem>
            <MenuItem value={"Kes"}>Kes</MenuItem>
            <MenuItem value={"Kris"}>Kris</MenuItem>
            <MenuItem value={"Tori"}>Tori</MenuItem>
          </Select>
          <Slider
            defaultValue={200}
            value={value}
            onChange={(event, num) => {
              setValue(num)
            }}
            step={1}
            valueLabelDisplay="auto"
            min={0}
            max={700}
          />
          <Input
            margin="dense"
            value={value}
            onChange={event => {
              setValue(event.target.value === '' ? '' : Number(event.target.value));
            }}
            inputProps ={{
              step: 1,
              min: 0,
              max: 700,
              type: 'number'
            }}
          />
          </FormControl>
          <DialogActions>
            <Button onClick={() => {
              if(name.length===0) return;
              fetch(`http://localhost:80/turnips?date=${new Date()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                  name: name,
                  price: value
                })
              })
              .then(res => res.json())
              .then(data=> props.setData(data));
              toggleDisplay();
            }}>
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );

}

export default AddObservation;

/*
          <TextField
            label="Name"
            error={name.length===0}
            onChange={event => {
              setName(event.target.value);
            }}
            autoFocus
          />*/