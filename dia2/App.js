import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import * as ScreenCapture from 'expo-screen-capture';
import { Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ScreenRecorderApp = () => {
  // Estados principais da aplicação
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Efeito para carregar gravações e solicitar permissões ao iniciar
  useEffect(() => {
    initializeApp();
  }, []);

  // Timer para controlar tempo de gravação
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  /**
   * Inicializa o app solicitando permissões e carregando gravações
   */
  const initializeApp = async () => {
    await requestPermissions();
    await loadRecordings();
  };

  /**
   * Solicita todas as permissões necessárias para o app
   * - Notificações
   * - Acesso à biblioteca de mídia
   * - Captura de tela (limitado no Expo)
   */
  const requestPermissions = async () => {
    try {
      // Permissão para notificações
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      
      // Permissão para acessar a biblioteca de mídia
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      if (notificationStatus === 'granted' && mediaStatus === 'granted') {
        setHasPermissions(true);
        console.log('✅ Todas as permissões concedidas');
      } else {
        Alert.alert(
          'Permissões Necessárias',
          'Este app precisa de permissões para funcionar corretamente.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert('Erro', 'Não foi possível solicitar as permissões necessárias');
    }
  };

  /**
   * Carrega todas as gravações salvas na pasta de documentos
   * No Expo, usamos FileSystem para gerenciar arquivos
   */
  const loadRecordings = async () => {
    try {
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      
      // Verifica se o diretório existe, se não, cria
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
        console.log('📁 Diretório de gravações criado');
        return;
      }

      // Lista todos os arquivos no diretório
      const files = await FileSystem.readDirectoryAsync(recordingsDir);
      const videoFiles = files.filter(file => 
        file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.m4v')
      );

      console.log(`📹 Encontradas ${videoFiles.length} gravações`);

      // Cria objetos de gravação com metadados
      const recordingsList = await Promise.all(
        videoFiles.map(async (file) => {
          const filePath = `${recordingsDir}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          
          return {
            id: file.replace(/\.[^/.]+$/, ''), // Remove extensão
            name: file,
            path: filePath,
            uri: filePath, // Para o Video component do Expo
            size: fileInfo.size || 0,
            date: new Date(fileInfo.modificationTime || Date.now()),
            duration: '00:00', // Seria necessário processar o vídeo para duração real
          };
        })
      );

      // Ordena por data (mais recente primeiro)
      recordingsList.sort((a, b) => b.date - a.date);
      setRecordings(recordingsList);
      
    } catch (error) {
      console.error('Erro ao carregar gravações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as gravações');
    }
  };

  /**
   * Controla início e fim da gravação
   * IMPORTANTE: Gravação real de tela não é possível no Expo managed workflow
   * Esta é uma simulação para fins educacionais
   */
  const toggleRecording = async () => {
    if (!hasPermissions) {
      Alert.alert('Erro', 'Permissões não concedidas. Reinicie o app e aceite as permissões.');
      return;
    }

    try {
      if (!isRecording) {
        // Inicia simulação de gravação
        setIsRecording(true);
        await showRecordingNotification();
        
        // Aviso sobre limitações do Expo
        if (__DEV__) {
          console.log('🎬 Iniciando simulação de gravação...');
          console.log('⚠️  Gravação real de tela requer Expo Bare Workflow ou React Native CLI');
        }
        
      } else {
        // Para gravação e salva arquivo simulado
        setIsRecording(false);
        await hideRecordingNotification();
        await saveSimulatedRecording();
        await loadRecordings();
        
        Alert.alert(
          'Gravação Concluída! 🎉',
          'Arquivo simulado salvo com sucesso!\n\nPara gravação real de tela, você precisaria usar:\n• Expo Bare Workflow\n• React Native CLI\n• Bibliotecas nativas específicas',
          [{ text: 'Entendi!' }]
        );
      }
    } catch (error) {
      console.error('Erro na gravação:', error);
      setIsRecording(false);
      Alert.alert('Erro', 'Ocorreu um erro durante a operação');
    }
  };

  /**
   * Exibe notificação durante a gravação usando Expo Notifications
   */
  const showRecordingNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔴 Gravando Tela',
          body: 'Toque para voltar ao app',
          data: { screen: 'recording' },
        },
        trigger: null, // Imediata
      });
      console.log('📱 Notificação de gravação exibida');
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  };

  /**
   * Remove a notificação de gravação
   */
  const hideRecordingNotification = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('📱 Notificações removidas');
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  };

  /**
   * Cria um arquivo simulado de gravação
   * Em uma implementação real, este seria o arquivo de vídeo gerado
   */
  const saveSimulatedRecording = async () => {
    try {
      const timestamp = new Date().getTime();
      const fileName = `recording_${timestamp}.mp4`;
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const filePath = `${recordingsDir}${fileName}`;

      // Cria um arquivo simulado (em uma implementação real seria o vídeo)
      const simulatedVideoData = JSON.stringify({
        type: 'simulated_recording',
        timestamp,
        duration: recordingTime,
        note: 'Este é um arquivo simulado. Para gravação real, use Expo Bare Workflow.'
      });

      await FileSystem.writeAsStringAsync(filePath, simulatedVideoData);
      console.log('💾 Arquivo simulado salvo:', fileName);
      
    } catch (error) {
      console.error('Erro ao salvar gravação simulada:', error);
      throw error;
    }
  };

  /**
   * Formata tempo em MM:SS
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Formata tamanho de arquivo de forma legível
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Abre gravação para visualização no modal
   */
  const openRecording = (recording) => {
    setSelectedRecording(recording);
    setModalVisible(true);
  };

  /**
   * Exclui uma gravação após confirmação
   */
  const deleteRecording = (recording) => {
    Alert.alert(
      'Excluir Gravação 🗑️',
      `Deseja realmente excluir "${recording.name}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(recording.path);
              await loadRecordings();
              Alert.alert('Sucesso ✅', 'Gravação excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro ❌', 'Não foi possível excluir a gravação');
            }
          },
        },
      ]
    );
  };

  /**
   * Componente para renderizar cada item da lista
   */
  const RecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        <Text style={styles.thumbnailIcon}>📹</Text>
      </View>
      
      {/* Informações */}
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recordingDetails}>
          {formatFileSize(item.size)} • {item.date.toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.recordingDuration}>
          ⏱️ {item.duration}
        </Text>
      </View>
      
      {/* Ações */}
      <View style={styles.recordingActions}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => openRecording(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>▶️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecording(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header com informações */}
      <View style={styles.header}>
        <Text style={styles.title}>📱 Gravador de Tela</Text>
        <Text style={styles.subtitle}>
          {recordings.length} gravação{recordings.length !== 1 ? 'ões' : ''} • Expo App
        </Text>
        {!hasPermissions && (
          <Text style={styles.permissionWarning}>
            ⚠️ Permissões pendentes
          </Text>
        )}
      </View>

      {/* Seção de Gravação */}
      <View style={styles.recordingSection}>
        {/* Botão principal de gravação */}
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={toggleRecording}
          activeOpacity={0.8}
          disabled={!hasPermissions}
        >
          <View style={styles.recordButtonInner}>
            {isRecording ? (
              <View style={styles.stopIcon} />
            ) : (
              <View style={styles.recordIcon} />
            )}
          </View>
        </TouchableOpacity>
        
        {/* Status da gravação */}
        <Text style={styles.recordStatus}>
          {isRecording 
            ? `🔴 Gravando ${formatTime(recordingTime)}` 
            : hasPermissions 
              ? '⏺️ Toque para gravar' 
              : '🚫 Sem permissões'
          }
        </Text>
        
        {/* Indicador visual durante gravação */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.recordingText}>REC</Text>
          </View>
        )}
        
        {/* Aviso sobre Expo */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Informação</Text>
          <Text style={styles.infoText}>
            Este app simula gravação de tela. Para funcionalidade real, use:
          </Text>
          <Text style={styles.infoList}>
            • Expo Bare Workflow{'\n'}
            • React Native CLI{'\n'}
            • Bibliotecas nativas específicas
          </Text>
        </View>
      </View>

      {/* Galeria de Gravações */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionTitle}>
          📂 Minhas Gravações {recordings.length > 0 && `(${recordings.length})`}
        </Text>
        
        {recordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyText}>Nenhuma gravação ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão vermelho acima para criar sua primeira gravação simulada
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RecordingItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recordingsList}
          />
        )}
      </View>

      {/* Modal de Visualização */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header do modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                📹 {selectedRecording?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Área do player (simulado) */}
            <View style={styles.playerArea}>
              <Text style={styles.playerIcon}>📺</Text>
              <Text style={styles.playerTitle}>Simulação de Player</Text>
              <Text style={styles.playerText}>
                Em uma implementação real com vídeos reais, aqui seria exibido o componente Video do Expo AV
              </Text>
              
              {/* Botões de controle simulados */}
              <View style={styles.playerControls}>
                <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                  <Text>⏮️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                  <Text>▶️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                  <Text>⏭️</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Detalhes do arquivo */}
            <View style={styles.fileDetails}>
              <Text style={styles.detailTitle}>📊 Detalhes do Arquivo</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📏 Tamanho:</Text>
                <Text style={styles.detailValue}>
                  {formatFileSize(selectedRecording?.size || 0)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Data:</Text>
                <Text style={styles.detailValue}>
                  {selectedRecording?.date?.toLocaleString('pt-BR')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⏱️ Duração:</Text>
                <Text style={styles.detailValue}>
                  {selectedRecording?.duration}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📂 Local:</Text>
                <Text style={[styles.detailValue, styles.pathText]} numberOfLines={2}>
                  {selectedRecording?.path}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  permissionWarning: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 5,
  },
  recordingSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#1a1a1a',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  recordButtonActive: {
    backgroundColor: '#ff3838',
    transform: [{ scale: 1.05 }],
  },
  recordButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  recordStatus: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ff4757',
    borderRadius: 25,
    marginBottom: 20,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    marginRight: 10,
  },
  recordingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#74b9ff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#74b9ff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  infoList: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  gallerySection: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#888888',
    fontWeight: '600',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  recordingsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    backgroundColor: '#3a3a3a',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#4a4a4a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  thumbnailIcon: {
    fontSize: 24,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  recordingDetails: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 4,
  },
  recordingDuration: {
    fontSize: 13,
    color: '#74b9ff',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  playButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#00b894',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.95,
    maxHeight: height * 0.85,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#3a3a3a',
    borderBottomWidth: 1,
    borderBottomColor: '#4a4a4a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 15,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  playerArea: {
    height: 250,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4a4a4a',
    borderStyle: 'dashed',
  },
  playerIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#74b9ff',
    marginBottom: 10,
  },
  playerText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 20,
  },
  playerControls: {
    flexDirection: 'row',
    gap: 15,
  },
  controlButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    padding: 25,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#74b9ff',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#888888',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#ffffff',
    flex: 2,
    textAlign: 'right',
  },
  pathText: {
    fontSize: 12,
    color: '#cccccc',
  },
});

export default ScreenRecorderApp;