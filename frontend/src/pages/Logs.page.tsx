import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PermalinksContext } from '@/contexts/Permalinks.context';
import { PERMALINK_DASHBOARD, PERMALINK_JOBS } from '@/utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatsBox = styled.div`
  width: 30%;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartContainer = styled.div`
  height: 100px;
  margin-bottom: 10px;
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;

const CapacityInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CapacityPercentage = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
`;

const CapacityDetails = styled.div`
  font-size: 12px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const MoviesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
`;

const TableCell = styled.td`
  padding: 10px;
  border-top: 1px solid #dee2e6;
`;

// Types
interface Movie {
  name: string;
  type: string;
  genre: string;
  views: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const movies: Movie[] = [
    {
      name: 'Another round',
      type: 'Movie',
      genre: 'Drama, Comedy',
      views: 8077,
      status: 'Need review',
    },
    {
      name: 'I care a lot',
      type: 'Movie',
      genre: 'Thriller, Crime, Comedy',
      views: 7108,
      status: 'Published',
    },
    {
      name: 'Parasite',
      type: 'Movie',
      genre: 'Comedy, Thriller, Drama',
      views: 9907,
      status: 'Draft',
    },
    {
      name: 'A quite place',
      type: 'Movie',
      genre: 'Thriller, Drama, Horror',
      views: 3402,
      status: 'Need review',
    },
    {
      name: 'Soul',
      type: 'Movie',
      genre: 'Fantasy, Comedy',
      views: 8706,
      status: 'Published',
    },
    {
      name: "The queen's gambit",
      type: 'TV Series',
      genre: 'Drama',
      views: 9801,
      status: 'Published',
    },
    {
      name: 'His dark materials',
      type: 'TV Series',
      genre: 'Fantasy, Drama',
      views: 5701,
      status: 'Published',
    },
    {
      name: 'Shadow and bone',
      type: 'TV Series',
      genre: 'Drama, Action, Fantasy',
      views: 3093,
      status: 'Need review',
    },
    {
      name: 'Raised by wolves',
      type: 'TV Series',
      genre: 'Thriller, Drama, Sci-Fi',
      views: 6003,
      status: 'Need review',
    },
    {
      name: 'Joker',
      type: 'Movie',
      genre: 'Thriller, Crime, Drama',
      views: 8097,
      status: 'Draft',
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  const generateChartData = (label: string) => ({
    labels: ['Day', 'Week', 'Month'],
    datasets: [
      {
        label: label,
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
    ],
  });

  const moviesChartData = generateChartData('Movies');
  const tvSeriesChartData = generateChartData('TV Series');

  const { setPermalinks } = useContext(PermalinksContext);
  useEffect(() => {
    setPermalinks([PERMALINK_JOBS]);
    return;
  }, []);

  return (
    <div className="p-4 bg-white rounded-tl-md overflow-y-hidden">
      <StatsContainer>
        <StatsBox>
          <h2>Movies</h2>
          <ChartContainer>
            <Line options={chartOptions} data={moviesChartData} />
          </ChartContainer>
          <ChartLabels>
            <span>New Movies: 5</span>
            <span>Under Review: 2</span>
            <span>Total Views: 983</span>
          </ChartLabels>
        </StatsBox>
        <StatsBox>
          <h2>TV Series</h2>
          <ChartContainer>
            <Line options={chartOptions} data={tvSeriesChartData} />
          </ChartContainer>
          <ChartLabels>
            <span>New Series: 3</span>
            <span>Under Review: 1</span>
            <span>Total Views: 483</span>
          </ChartLabels>
        </StatsBox>
        <StatsBox>
          <h2>Capacity</h2>
          <CapacityInfo>
            <CapacityPercentage>27%</CapacityPercentage>
            <CapacityDetails>
              <p>Total Space: 1505GB</p>
              <p>Used Space: 407GB</p>
              <p>Free Space: 1098GB</p>
            </CapacityDetails>
          </CapacityInfo>
        </StatsBox>
      </StatsContainer>

      <FilterContainer>
        <input type="text" placeholder="Search for Movies or TV series name" />
        <select>
          <option>All</option>
        </select>
        <select>
          <option>Genre</option>
        </select>
        <select>
          <option>Status</option>
        </select>
        <button>Filter results</button>
      </FilterContainer>

      <MoviesTable>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Genre</TableHeader>
            <TableHeader>Views</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <TableCell>{movie.name}</TableCell>
              <TableCell>{movie.type}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{movie.views}</TableCell>
              <TableCell>{movie.status}</TableCell>
              <TableCell>
                <button>Edit</button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </MoviesTable>
    </div>
  );
};

export default Dashboard;
