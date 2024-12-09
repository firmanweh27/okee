import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '@react-navigation/drawer';

// Inisialisasi Drawer Navigator
const Drawer = createDrawerNavigator();

// URL API dengan Proxy CORS
const apiURL = 'https://cors-anywhere.herokuapp.com/https://mmc-clinic.com/dipa/api/mhs.php';

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  kelas: string;
  points: string | null;
}

// Halaman Pemanggil API
const ApiScreen = () => {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data from API...');
      const response = await fetch(apiURL);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data yang diterima:', result);

      if (result.status === 'success' && Array.isArray(result.data)) {
        const randomData = getRandomItems(result.data, 10);
        setData(randomData);
      } else {
        setError('Format data tidak valid atau kosong.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan jaringan atau server tidak merespons.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRandomItems = (arr: Mahasiswa[], numItems: number): Mahasiswa[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Berikut adalah 10 orang kawan saya di Prodi SI secara random</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.text}>NIM: {item.nim}</Text>
                <Text style={styles.text}>Nama: {item.nama}</Text>
                <Text style={styles.text}>Kelas: {item.kelas}</Text>
                <Text style={styles.text}>Points: {item.points || 'Tidak tersedia'}</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

// Stack 1: HomeScreen - Menampilkan Foto Profil, Deskripsi, NIM, dan Nama
const HomeScreen = () => {
  const [task, setTask] = useState(''); // State untuk task input
  const [tasks, setTasks] = useState<string[]>([]); // State untuk daftar tugas

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask(''); // Reset input setelah menambahkan tugas
    }
  };

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(newTasks);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={[styles.container, styles.border]}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://media-cgk2-1.cdn.whatsapp.net/v/t61.24694-24/468933809_453250327545213_3989911470315984905_n.jpg?stp=dst-jpg_tt6&ccb=11-4&oh=01_Q5AaILS_3CXCtCl55OX_f0PIRmh6tse6VL7HIU43nhX4_4_Q&oe=6763A288&_nc_sid=5e03e0&_nc_cat=105' }} // Ganti dengan URL gambar kamu
            style={styles.profileImage}
          />
          <Text style={styles.title}>M. Firmansyah</Text>
        </View>
        <Text style={styles.text}>NIM: 222505011</Text>
      </View>

      {/* To-Do List */}
      <View style={styles.todoContainer}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Tambah tugas..."
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Tambah Tugas</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskText}>{item}</Text>
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <Text style={styles.deleteButton}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

// Stack 2: AboutMeScreen - Menampilkan deskripsi tentang diri
const AboutMeScreen = () => (
  <View style={styles.screenContainer}>
    <View style={[styles.container, styles.border]}>
      <Text style={styles.title}>Tentang Saya</Text>
      <Text style={styles.text}>Saya adalah seorang mahasiswa semester 5 universitas ma'soem yang sedang belajar react native.</Text>
    </View>
  </View>
);

// Stack 3: HobbiesScreen - Menampilkan daftar hobi
const HobbiesScreen = () => (
  <View style={styles.screenContainer}>
    <View style={[styles.container, styles.border]}>
      <Text style={styles.title}>Hobi Saya</Text>
      <Text style={styles.text}>1. Voly</Text>
      <Text style={styles.text}>2. MAin game</Text>
      <Text style={styles.text}>3. Menonton Film</Text>
      <Text style={styles.text}>4. Renang</Text>
      <Text style={styles.text}>5. Running</Text>
    </View>
  </View>
);

// Custom Drawer Content untuk menambahkan foto profil kecil
const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <View style={{ flex: 1 }}>
    {/* Foto Profil Kecil */}
    <View style={styles.drawerProfileContainer}>
      <Image
        source={{ uri: 'https://media-cgk2-1.cdn.whatsapp.net/v/t61.24694-24/468933809_453250327545213_3989911470315984905_n.jpg?stp=dst-jpg_tt6&ccb=11-4&oh=01_Q5AaILS_3CXCtCl55OX_f0PIRmh6tse6VL7HIU43nhX4_4_Q&oe=6763A288&_nc_sid=5e03e0&_nc_cat=105' }} // Ganti dengan URL gambar kamu
        style={styles.drawerProfileImage}
      />
      <Text style={styles.drawerTitle}>M. Firmamnsyah</Text>
    </View>

    {/* Menampilkan menu drawer */}
    <DrawerContent {...props} />
  </View>
);

// Fungsi untuk Drawer Navigation
const AppDrawer = () => (
  // Correct usage: use `component` prop inside `Screen` for each screen
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="AboutMe" component={AboutMeScreen} />
    <Drawer.Screen name="Hobbies" component={HobbiesScreen} />
    <Drawer.Screen name="API Data" component={ApiScreen} />
  </Drawer.Navigator>
);

// Aplikasi utama dengan Drawer Navigator
const App = () => (
  <NavigationContainer>
    <AppDrawer />
  </NavigationContainer>
);

export default App;

// Styling using StyleSheet
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 600,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  border: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  todoContainer: {
    marginTop: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    color: 'red',
    fontSize: 14,
  },
  drawerProfileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  drawerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20, // Adding padding for smooth scrolling at the bottom
  },
  listItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
