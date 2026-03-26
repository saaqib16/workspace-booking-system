import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getRoomName(roomId, rooms) {
  const match = rooms.find((room) => String(room.id) === String(roomId));
  return match ? match.roomName : `Room ${roomId}`;
}

export default function Analytics({ analytics, loading, error, rooms }) {
  if (loading) {
    return (
      <section className="panel-card analytics-wrap">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Analytics</h2>
            <p className="panel-card__subtitle">Loading booking insights...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-card analytics-wrap">
        <div className="panel-card__header">
          <div>
            <h2 className="panel-card__title">Analytics</h2>
            <p className="panel-card__subtitle">
              The analytics service returned an error.
            </p>
          </div>
        </div>
        <div className="error-state">{error}</div>
      </section>
    );
  }

  const roomUsage = analytics?.roomUsage || {};
  const labels = Object.keys(roomUsage).map((roomId) => getRoomName(roomId, rooms));
  const values = Object.values(roomUsage);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: values,
        borderRadius: 12,
        backgroundColor: [
          "rgba(216, 109, 67, 0.9)",
          "rgba(24, 49, 83, 0.86)",
          "rgba(46, 125, 97, 0.86)",
          "rgba(218, 178, 84, 0.86)",
          "rgba(108, 117, 125, 0.86)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Bookings per room",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <section className="panel-card analytics-wrap">
      <div className="panel-card__header">
        <div>
          <h2 className="panel-card__title">Analytics</h2>
          <p className="panel-card__subtitle">
            Usage metrics powered by `/api/analytics`.
          </p>
        </div>
        <span className="badge-soft">
          {analytics?.totalBookings ?? 0} total bookings
        </span>
      </div>

      {values.length === 0 ? (
        <div className="empty-state">
          Analytics will appear here after the first booking is created.
        </div>
      ) : (
        <div className="chart-frame">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </section>
  );
}
