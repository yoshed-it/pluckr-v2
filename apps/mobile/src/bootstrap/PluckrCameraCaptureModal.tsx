import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  CameraView,
  type CameraCapturedPicture,
  type CameraType,
  useCameraPermissions
} from "expo-camera";
import type { ChartUploadAsset } from "@pluckr/app-core";

type PluckrCameraCaptureModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirmCapture: (asset: ChartUploadAsset) => void;
};

/**
 * Native treatment-photo capture with an in-app review step.
 *
 * This keeps Pluckr in control of the flow instead of handing capture off to a
 * generic picker UI that is harder to evolve for clinical use.
 */
export function PluckrCameraCaptureModal({
  visible,
  onClose,
  onConfirmCapture
}: PluckrCameraCaptureModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [preview, setPreview] = useState<CameraCapturedPicture | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  async function handleCapture() {
    if (!cameraRef.current || !isReady || isCapturing) {
      return;
    }

    setIsCapturing(true);

    try {
      const captured = await cameraRef.current.takePictureAsync({
        quality: 0.7
      });

      if (captured) {
        setPreview(captured);
      }
    } catch {
      Alert.alert(
        "Capture failed",
        "Pluckr could not capture this treatment image. Please try again."
      );
    } finally {
      setIsCapturing(false);
    }
  }

  async function handleUsePhoto() {
    if (!preview?.uri) {
      return;
    }

    const response = await fetch(preview.uri);
    const blob = await response.blob();

    onConfirmCapture({
      fileName: `chart-image-${Date.now()}.jpg`,
      mimeType: blob.type || "image/jpeg",
      bytes: await blob.arrayBuffer()
    });

    setPreview(null);
    setTorchEnabled(false);
  }

  function handleClose() {
    setPreview(null);
    setTorchEnabled(false);
    setFacing("back");
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {!permission ? (
          <CenteredMessage
            title="Preparing camera"
            copy="Pluckr is checking camera access."
          />
        ) : !permission.granted ? (
          <CenteredPermission
            onRequestPermission={() => void requestPermission()}
            onClose={handleClose}
          />
        ) : preview ? (
          <View style={styles.previewShell}>
            <Image
              source={{ uri: preview.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
            <View style={styles.previewActions}>
              <ActionButton label="Retake" onPress={() => setPreview(null)} />
              <PrimaryActionButton
                label="Use Photo"
                onPress={() => void handleUsePhoto()}
              />
            </View>
          </View>
        ) : (
          <View style={styles.cameraShell}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              enableTorch={torchEnabled}
              onCameraReady={() => setIsReady(true)}
              onMountError={() => {
                setIsReady(false);
                Alert.alert(
                  "Camera unavailable",
                  "Pluckr could not start the camera on this device."
                );
              }}
            />
            <View style={styles.topBar}>
              <ActionButton label="Close" onPress={handleClose} />
              <ActionButton
                label={torchEnabled ? "Torch On" : "Torch Off"}
                onPress={() => setTorchEnabled((current) => !current)}
              />
            </View>
            <View style={styles.bottomBar}>
              <ActionButton
                label={facing === "back" ? "Rear" : "Front"}
                onPress={() =>
                  setFacing((current) => (current === "back" ? "front" : "back"))
                }
              />
              <CaptureButton
                disabled={!isReady || isCapturing}
                onPress={() => void handleCapture()}
              />
              <Text style={styles.helperText}>Take photo</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

function CenteredPermission({
  onRequestPermission,
  onClose
}: {
  onRequestPermission: () => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.centeredState}>
      <Text style={styles.stateTitle}>Camera access is required</Text>
      <Text style={styles.stateCopy}>
        Pluckr captures treatment images directly in-app and does not use the
        photo library in this flow.
      </Text>
      <View style={styles.previewActions}>
        <ActionButton label="Close" onPress={onClose} />
        <PrimaryActionButton
          label="Allow Camera"
          onPress={onRequestPermission}
        />
      </View>
    </View>
  );
}

function CenteredMessage({ title, copy }: { title: string; copy: string }) {
  return (
    <View style={styles.centeredState}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateCopy}>{copy}</Text>
    </View>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </Pressable>
  );
}

function PrimaryActionButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primaryActionButton} onPress={onPress}>
      <Text style={styles.primaryActionButtonLabel}>{label}</Text>
    </Pressable>
  );
}

function CaptureButton({
  disabled,
  onPress
}: {
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.captureButton, disabled ? styles.captureButtonDisabled : null]}
      onPress={onPress}
    >
      <View style={styles.captureButtonInner} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1418" },
  cameraShell: { flex: 1 },
  camera: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 58,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 44,
    alignItems: "center",
    gap: 14
  },
  helperText: { color: "#f3efe8", fontSize: 13, fontWeight: "600" },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center"
  },
  actionButtonLabel: { color: "#fff", fontSize: 13, fontWeight: "700" },
  primaryActionButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#f3efe8",
    alignItems: "center",
    justifyContent: "center"
  },
  primaryActionButtonLabel: { color: "#162028", fontSize: 14, fontWeight: "700" },
  captureButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center"
  },
  captureButtonDisabled: { opacity: 0.45 },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3efe8"
  },
  previewShell: { flex: 1, justifyContent: "center", padding: 20, gap: 20 },
  previewImage: { flex: 1, borderRadius: 20, backgroundColor: "#11181d" },
  previewActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12
  },
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12
  },
  stateTitle: {
    color: "#f3efe8",
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center"
  },
  stateCopy: {
    color: "rgba(243,239,232,0.8)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  }
});
