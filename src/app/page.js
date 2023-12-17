import styles from './index.css';
import { Canvas } from '@react-three/fiber'
import Floor from './components/Floor';

export default function Home() {
  return (
    <div className={styles.scene}>
      <Canvas
        shadows
        className={styles.canvas}
        camera={{
          position: [-6, 7, 7],
        }}
      >
        <Floor position={[0, -1, 0]} />
      </Canvas>
    </div>
  );
}
