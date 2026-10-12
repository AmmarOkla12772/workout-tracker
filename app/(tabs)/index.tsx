import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type MuscleGroup = "chest" | "back" | "arms" | "legs" | "shoulders" | "core";

type Exercise = {
  id: number;
  name: string;
  weight: number;
  reps: number;
  completed: boolean;
  muscleGroup: MuscleGroup;
};

// --------------------------------------------------
// CHILD COMPONENT
// --------------------------------------------------

type ExerciseCardProps = {
  exercise: Exercise;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function ExerciseCard({ exercise, onDelete, onToggle }: ExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}> Exercise Name:{exercise.name}</Text>
        <Text style={styles.cardStats}>
          {exercise.completed ? "Completed" : "Not Completed"}
        </Text>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => onDelete(exercise.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={() => onToggle(exercise.id)}
      >
        <Text>Toggle Completion</Text>
      </Pressable>
    </View>
  );
}

// --------------------------------------------------
// MAIN SCREEN
// --------------------------------------------------

export default function Index() {
  // ------------------------------------------------
  // STATE
  // ------------------------------------------------

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: "Shoulder Press",
      muscleGroup: "shoulders",
      weight: 45,
      reps: 10,
      completed: true,
    },
    {
      id: 2,
      name: "Lat Pulldown",
      muscleGroup: "back",
      weight: 55,
      reps: 8,
      completed: false,
    },
  ]);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>("chest");

  // ------------------------------------------------
  // REF
  // ------------------------------------------------

  const nameInputRef = useRef<TextInput>(null);

  // ------------------------------------------------
  // EFFECT
  // ------------------------------------------------

  useEffect(() => {
    console.log("Exercise list changed:", exercises.length);
  }, [exercises]);

  // ------------------------------------------------
  // MEMO
  // ------------------------------------------------

  const totalWeight = useMemo(() => {
    return exercises.reduce((total, exercise) => total + exercise.weight, 0);
  }, [exercises]);

  // ------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------

  function addExercise() {
    if (
      !name.trim() ||
      Number(reps) <= 0 ||
      Number(weight) <= 0 ||
      !Number.isFinite(Number(reps)) ||
      !Number.isFinite(Number(weight)) ||
      !Number.isInteger(Number(reps))
    ) {
      return;
    }

    const newExercise: Exercise = {
      id: Date.now(),
      name: name,
      weight: Number(weight),
      reps: Number(reps),
      muscleGroup: selectedMuscle,
      completed: false,
    };

    setExercises((currentExercises) => [...currentExercises, newExercise]);

    setName("");
    setWeight("");
    setReps("");

    nameInputRef.current?.focus();
  }

  function removeExercise(id: number) {
    setExercises((currentExercises) =>
      currentExercises.filter((exercise) => exercise.id !== id),
    );
  }

  function toggleCompletion(id: number) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise,
      ),
    );
  }

  function clearExercises() {
    setExercises([]);
  }

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>Gym Tracker</Text>

            <Text style={styles.subtitle}>React Native Practice Screen</Text>
          </View>

          {/* SUMMARY */}

          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{exercises.length}</Text>
              <Text style={styles.summaryLabel}>Exercises</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{totalWeight}</Text>
              <Text style={styles.summaryLabel}>Total kg</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {exercises.filter((exercise) => exercise.completed).length}/
                {exercises.length}
              </Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
          </View>

          {/* EXERCISE LIST */}

          <Text style={styles.sectionTitle}>Exercises</Text>

          {exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No exercises yet.</Text>
            </View>
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                //<ExerciseCard exercise={item} onDelete={removeExercise} />
                <ExerciseCard
                  exercise={item}
                  onDelete={removeExercise}
                  onToggle={toggleCompletion}
                />
              )}
            />
          )}

          {/* CLEAR BUTTON */}

          {exercises.length > 0 && (
            <Pressable style={styles.clearButton} onPress={clearExercises}>
              <Text style={styles.clearButtonText}>Clear All Exercises</Text>
            </Pressable>
          )}

          {/* ADD EXERCISE */}

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Add Exercise</Text>

            <Text style={styles.label}>Exercise name</Text>

            <TextInput
              ref={nameInputRef}
              style={styles.input}
              placeholder="e.g. Bench Press"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Weight</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 60"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />

            <Text style={styles.label}>Reps</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />

            {/* MUSCLE GROUP */}

            <Text style={styles.label}>Muscle group</Text>

            <View style={styles.muscleButtons}>
              {(
                [
                  "chest",
                  "back",
                  "arms",
                  "legs",
                  "shoulders",
                  "core",
                ] as MuscleGroup[]
              ).map((muscle) => (
                <Pressable
                  key={muscle}
                  style={[
                    styles.muscleButton,
                    selectedMuscle === muscle && styles.selectedMuscleButton,
                  ]}
                  onPress={() => setSelectedMuscle(muscle)}
                >
                  <Text
                    style={[
                      styles.muscleButtonText,
                      selectedMuscle === muscle &&
                        styles.selectedMuscleButtonText,
                    ]}
                  >
                    {muscle}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ADD */}

            <Pressable style={styles.addButton} onPress={addExercise}>
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </Pressable>
          </View>

          {/* PLATFORM INFO */}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Platform</Text>

            <Text style={styles.infoText}>
              This app is currently running on: {Platform.OS}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },

  summary: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  summaryItem: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },

  summaryLabel: {
    marginTop: 5,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  cardStats: {
    fontSize: 15,
    marginTop: 8,
  },

  deleteButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteButtonText: {
    fontWeight: "bold",
  },

  emptyBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  emptyText: {
    color: "#777",
  },

  clearButton: {
    padding: 12,
    alignItems: "center",
    marginBottom: 25,
  },

  clearButtonText: {
    color: "#777",
  },

  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },

  muscleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  muscleButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  selectedMuscleButton: {
    backgroundColor: "#222",
    borderColor: "#222",
  },

  muscleButtonText: {
    textTransform: "capitalize",
  },

  selectedMuscleButtonText: {
    color: "white",
  },

  addButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  infoBox: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },

  infoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  infoText: {
    color: "#555",
  },
});
