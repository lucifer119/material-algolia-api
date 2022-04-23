import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

export const AlgoliaRequest = () => {
  const [data, setData] = useState([]);
  const columns = ["Title", "URL Created At", "Author"];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const names = ["title","created_at","author"];
  let rows = [];
  
  const handleChangePage = (event, newPage) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const fetchRequest = async (props) => {
    const url = "https://hn.algolia.com/api/v1/search_by_date?query=story&page="+props;

    await fetch(url)
      .then((response) => response?.json())
      .then((response) => {
        setData(prevResponse => [...prevResponse,response.hits]);
      })
      .catch((error) => {
        console.log(error);
      });
      
  };

  useEffect(() => {
      let pageCount = 0;
            setInterval(() => {
                if(pageCount<20){
                fetchRequest(pageCount);
                pageCount++;
                }
            }, 1000);
  }, []);
  
    data?.map((obj) => {
        obj?.map((ele) => {
            let {title, created_at,author} = ele;
            title = title? title:'Untitled';
            rows.push({title, created_at,author});
        });
      
      });
  return(
      <>
         <TableContainer sx={{ height: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {names.map((name) => {
                      const value = row[name];
                      return (
                        <TableCell>
                         {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </>
  );
};

export default AlgoliaRequest;
