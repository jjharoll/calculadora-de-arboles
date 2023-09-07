import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import TreeImage from './logo.png'; // Importa tu logo de empresa
import { useTable, useFilters } from 'react-table';

function App() {
  const [capacidadInstalada, setCapacidadInstalada] = useState('');
  const [horasProdDiaria, setHorasProdDiaria] = useState('');
  const [resultadoEmisiones, setResultadoEmisiones] = useState(null);
  const [arboles, setArboles] = useState(null);
  const [hectareas, setHectareas] = useState(null);
  const [resultadosAnteriores, setResultadosAnteriores] = useState([]);

  const factorEmision = 0.504;
  const capturaArbolMaduro = 0.021;
  const arbolesPorHectarea = 1100;

  const formatNumber = (value) => {
    // Remueve cualquier caracter que no sea un dígito o coma
    const formattedValue = value.replace(/[^0-9,]/g, '');
    return formattedValue;
  };

  const handleCapacidadInstaladaChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatNumber(rawValue);
    setCapacidadInstalada(formattedValue);
  };

  const guardarResultado = () => {
    const resultado = {
      capacidadInstalada,
      horasProdDiaria,
      resultadoEmisiones,
      arboles,
      hectareas,
    };

    // Guarda el resultado en el LocalStorage
    localStorage.setItem('ultimoResultado', JSON.stringify(resultado));
  };

  const calcular = () => {
    const capacidadInstaladaFloat = parseFloat(capacidadInstalada.replace(',', '.'));
    const horasProdDiariaFloat = parseFloat(horasProdDiaria);

    if (!isNaN(capacidadInstaladaFloat) && !isNaN(horasProdDiariaFloat)) {
      const reduccionEmisiones = (capacidadInstaladaFloat * horasProdDiariaFloat * 365) * factorEmision;
      const arbolesCalculados = reduccionEmisiones / capturaArbolMaduro;
      const hectareasCalculadas = arbolesCalculados / arbolesPorHectarea;

      // Redondea los resultados y formatea para mostrar miles sin decimales
      const resultadoEmisionesRedondeado = Math.round(reduccionEmisiones).toLocaleString();
      const arbolesRedondeados = Math.round(arbolesCalculados).toLocaleString();
      const hectareasRedondeadas = Math.round(hectareasCalculadas).toLocaleString();

      setResultadoEmisiones(resultadoEmisionesRedondeado);
      setArboles(arbolesRedondeados);
      setHectareas(hectareasRedondeadas);

      // Guarda el resultado actual en la lista de resultados anteriores
      const resultadoActual = {
        capacidadInstalada,
        horasProdDiaria,
        resultadoEmisiones: resultadoEmisionesRedondeado,
        arboles: arbolesRedondeados,
        hectareas: hectareasRedondeadas,
      };

      setResultadosAnteriores([resultadoActual, ...resultadosAnteriores]);

      // Guarda el último resultado en el LocalStorage
      guardarResultado();
    } else {
      setResultadoEmisiones(null);
      setArboles(null);
      setHectareas(null);
    }
  };

  useEffect(() => {
    // Cargar el último resultado almacenado en el LocalStorage al cargar la página
    const ultimoResultadoGuardado = localStorage.getItem('ultimoResultado');
    if (ultimoResultadoGuardado) {
      const resultado = JSON.parse(ultimoResultadoGuardado);
      setCapacidadInstalada(resultado.capacidadInstalada);
      setHorasProdDiaria(resultado.horasProdDiaria);
      setResultadoEmisiones(resultado.resultadoEmisiones);
      setArboles(resultado.arboles);
      setHectareas(resultado.hectareas);
    }
  }, []);

  const pageStyle = {
    background: 'white', // Fondo blanco
    minHeight: '100vh', // Establece el alto mínimo para ocupar toda la pantalla
    padding: '20px', // Agregado para espacio interior
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Divide en dos columnas
    gridGap: '20px', // Espacio entre las columnas
  };

  const calculatorStyle = {
    padding: '20px',
    background: '#DFF3EC', // Fondo verde
    color: 'black', // Texto negro
    textAlign: 'center',
  };

  const buttonStyle = {
    background: '#00A86B', // Verde de la empresa
    color: 'white', // Texto blanco
    marginTop: '10px',
  };

  const resultadoStyle = {
    fontSize: '30px', // Tamaño de fuente grande
  };

  const negritaStyle = {
    fontWeight: 'bold', // Estilo negrita
  };

  const data = React.useMemo(() => resultadosAnteriores, [resultadosAnteriores]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Capacidad Instalada (MW)',
        accessor: 'capacidadInstalada',
      },
      {
        Header: 'Horas de Prod Diaria (Horas)',
        accessor: 'horasProdDiaria',
      },
      {
        Header: 'Reducción de Emisiones (tonCO2)',
        accessor: 'resultadoEmisiones',
      },
      {
        Header: 'Árboles Necesarios (tonCO2)',
        accessor: 'arboles',
      },
      {
        Header: 'Hectáreas Necesarias (Ha)',
        accessor: 'hectareas',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters
  );

  return (
    <div style={pageStyle}>
      <div style={calculatorStyle}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} align="center">
            <img src={TreeImage} alt="Logo de la empresa" style={{ width: '150px', height: '150px' }} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Capacidad Instalada (MW)"
              variant="outlined"
              value={capacidadInstalada}
              onChange={handleCapacidadInstaladaChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Horas de Prod Diaria (Horas)"
              variant="outlined"
              value={horasProdDiaria}
              onChange={(e) => setHorasProdDiaria(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" style={buttonStyle} onClick={calcular}>
              Calcular
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" style={resultadoStyle}>
              Resultados:
            </Typography>
            {resultadoEmisiones !== null && (
              <Typography style={resultadoStyle}>
                Reducción de Emisiones: <span style={negritaStyle}>{resultadoEmisiones}</span> tonCO2
              </Typography>
            )}
            {arboles !== null && (
              <Typography style={resultadoStyle}>
                Árboles Necesarios: <span style={negritaStyle}>{arboles}</span> tonCO2
              </Typography>
            )}
            {hectareas !== null && (
              <Typography style={resultadoStyle}>
                Hectáreas Necesarias: <span style={negritaStyle}>{hectareas}</span> Ha
              </Typography>
            )}
          </Grid>
        </Grid>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table {...getTableProps()} style={{ tableLayout: 'auto' }}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell {...column.getHeaderProps()} style={negritaStyle}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Typography variant="body2">
            Powered by: Sucella
          </Typography>
          <div style={{ margin: 'auto', textAlign: 'center', padding: '30px' }}>
            <img src={TreeImage} alt="Sucella Logo" style={{ width: '80px', height: '80px', marginLeft: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
