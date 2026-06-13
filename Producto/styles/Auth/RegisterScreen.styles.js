import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
  },
  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    width: 105,
    height: 105,
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 40,
  },
  label: {
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  passwordContainer: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 10,
  },
  registerButton: {
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  loginText: {
    color: '#42B65A',
    fontWeight: '800',
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 8,
  },
  relationshipButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  relationshipButtonSelected: {
    backgroundColor: '#42B65A',
  },
  relationshipText: {
    color: '#2D3436',
    fontWeight: '700',
  },
  relationshipTextSelected: {
    color: '#FFFFFF',
  },

  termsContainer: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginTop: 18,
},

checkbox: {
  width: 24,
  height: 24,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#42B65A',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  marginTop: 2,
},

checkboxSelected: {
  backgroundColor: '#42B65A',
},

termsTextContainer: {
  flex: 1,
},

termsText: {
  fontWeight: '700',
  lineHeight: 20,
},

termsLink: {
  color: '#42B65A',
  fontWeight: '900',
},

registerButtonDisabled: {
  opacity: 0.55,
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},

termsModalCard: {
  width: '100%',
  maxHeight: '86%',
  borderRadius: 26,
  padding: 20,
  elevation: 8,
},

termsModalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 14,
},

termsModalTitle: {
  fontWeight: '900',
  marginLeft: 8,
},

termsModalContent: {
  paddingBottom: 12,
},

termsModalSection: {
  fontSize: 15,
  fontWeight: '900',
  marginTop: 12,
  marginBottom: 5,
},

termsModalParagraph: {
  fontSize: 14,
  fontWeight: '600',
  lineHeight: 21,
},

acceptTermsButton: {
  backgroundColor: '#42B65A',
  borderRadius: 16,
  paddingVertical: 14,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 14,
},

acceptTermsButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '900',
  marginLeft: 8,
},

closeTermsButton: {
  alignItems: 'center',
  marginTop: 12,
},

closeTermsText: {
  color: '#E74C3C',
  fontSize: 15,
  fontWeight: '900',
},

inputError: {
  borderWidth: 2,
  borderColor: '#E74C3C',
  backgroundColor: '#FDECEC',
},

errorText: {
  color: '#E74C3C',
  fontSize: 13,
  fontWeight: '800',
  marginTop: 6,
  marginBottom: 4,
},
});