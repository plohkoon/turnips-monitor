import React, {useState, useEffect} from 'react';
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TablePagination } from '@material-ui/core';

function DataTable(props) {

  let [data, setData] = useState([]);
  let [sortDir, setSortDir] = useState(false);
  let [sortType, setSortType] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPer, setRowsPer] = useState(10);

  useEffect(() => setData(props.data), [props.data]);

  function sortList(sortProperty) {

    if(sortProperty === sortType) {
      setSortDir(!sortDir);
      setData(data.reverse());
      return;
    }

    setSortType(sortProperty);
    setSortDir(false);

    let sortedData = data.sort((f,s) => {
      switch (sortProperty) {
        case 0:
          return (new Date(f.date)) - (new Date(s.date));
        case 1:
          return f.name.localeCompare(s.name);
        case 2:
          return f.price - s.price;
        default:
          return 0;
      }
    });
    setData(sortedData);

  }

  function changePage(event, newPage) {
    setPage(newPage);
  }

  function changeRowsPerPage(event) {
    setRowsPer(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
  <Paper>
    <TableContainer component={Paper}>
      <Table>
        
        <TableHead>
          <TableRow>
            <TableCell align={"center"}>
                  <TableSortLabel
                    active={sortType === 0}
                    direction={sortDir ? 'asc' : 'desc'}
                    onClick={() => sortList(0)}
                  />
              Date
            </TableCell>
            <TableCell align={"center"}>
                  <TableSortLabel
                    active={sortType === 1}
                    direction={sortDir ? 'asc' : 'desc'}
                    onClick={() => sortList(1)}
                  />
              Name
            </TableCell>
            <TableCell align={"center"}>
                  <TableSortLabel
                    active={sortType === 2}
                    direction={sortDir ? 'asc' : 'desc'}
                    onClick={() => sortList(2)}
                  />
              Price
            </TableCell>
          </TableRow>
        </TableHead>


        <TableBody>
          {
            data
              .slice(page * rowsPer, page * rowsPer + rowsPer)
              .map(row => (
              <TableRow key={row.id}>
                <TableCell align="right">
                  {row.date}
                </TableCell>
                <TableCell align="right">
                  {row.name.replace(/^'/, "").replace(/'$/, "")}
                </TableCell>
                <TableCell align="right">
                  {row.price}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
        
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5,10,25]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPer}
      page={page}
      onChangePage={changePage}
      onChangeRowsPerPage={changeRowsPerPage}
    />
  </Paper>
  );   

}

export default DataTable;