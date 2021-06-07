import React from 'react';
//qfggtg
import { Animated, Modal, TextInput, TouchableOpacity, ScrollView, StatusBar, Dimensions, 
        StyleSheet, Easing, View, Text, FlatList, SafeAreaView, Alert } from 'react-native';


import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyle , setColor, setFont} from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { isAndroid, ifAndroid, currencyFormatDE , getConstant, isEqual } from '../../Utils';
import { URL_AWS, getProduct, createTicket, getAllTicket, getTicket } from '../../API/APIAWS';

import { CAutocall2 } from '../../Classes/Products/CAutocall2';
import { CFollowedTicket } from '../../Classes/Tickets/CFollowedTicket';
import FLAnimatedSVG from '../commons/FLAnimatedSVG';

import * as DocumentPicker from 'expo-document-picker';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';

import { WebView } from 'react-native-webview';
import FollowingAutocallTemplate  from './FollowingAutocallTemplate';
import FollowingDemandeGenerale  from './FollowingDemandeGenerale';

const NAVBAR_HEIGHT = 45;




const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


class FollowingScreen extends React.Component {
 
	constructor(props) {
		super(props);

		//const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		const scrollAnim = new Animated.Value(0);
		const offsetAnim = new Animated.Value(0);

		this.state = {
			//animation barre de recherche
			positionLeft: new Animated.Value(getConstant('width')), //indicateur si recherche ou pas 

			isLoading : true,
			productsFollowed : [],

			showAddProductModal : false,

			scrollAnim,
			offsetAnim,
			clampedScroll: Animated.diffClamp(
				Animated.add(
				scrollAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 1],
					extrapolateLeft: 'clamp',
				}),
				offsetAnim,
				),
				0,
				NAVBAR_HEIGHT ,
			),

			//fichiers a uploader pour monitoring
			isLoadingCreationTicket : false,
			productNameAddProduct : '',
			productCommentAddProduct : '',
			filesToUpload : [],
			isErrorLoading : false
		};
	
		
		this.underlyings = [];
	}

	

	_clampedScrollValue = 0;
	_offsetValue = 0;
	_scrollValue = 0;

	static navigationOptions = ({ navigation }) => {
		return ({
			headerShown : false
		}
		);
	}

	async componentDidMount() {

		//StatusBarManager.getHeight(({height}) => console.log("HAUTEUR STATUS BAR : " + height));
		this.state.scrollAnim.addListener(({ value }) => {
		const diff = value - this._scrollValue;
		this._scrollValue = value;
		this._clampedScrollValue = Math.min(
			Math.max(this._clampedScrollValue + diff, 0),
			NAVBAR_HEIGHT ,
		);
		});
		this.state.offsetAnim.addListener(({ value }) => {
		this._offsetValue = value;
		});



		this._loadFromServer();
	}

	async _loadFromServer() {
		try {
			this.underlyings = await this.props.getAllUndelyings();
			var tickets = await getAllTicket(this.props.firebase, 'FOLLOWEDTICKETS');
			this.setState({ productsFollowed : tickets['userTickets'], isLoading : false, isErrorLoading : false});
		} catch(error) {
			this.setState({ isLoading : false,  isErrorLoading : true});
			setTimeout(() => {
				Alert.alert(
					'Erreur',
					'Impossible de récupérer les produits suivis',
					[{text: 'OK', onPress: () => console.log("ok")}],
					{cancelable: false},
				);
				}, 1000);
		}
	}

	async UNSAFE_componentWillReceiveProps(props) {
		//on checke les notifications et on recharge eventuellement
		if (!isEqual(props.allNotificationsCount, this.props.allNotificationsCount)) {
			var allTickets = this.state.productsFollowed;
			var allTicketsUpdated = [];
			let i = 0;

			for (const ticket of allTickets) {
				//console.log("est Notifié " +  ticket.id + " : " + this.props.isNotified('TICKET', ticket.id));
				if (this.props.isNotified('TICKET', ticket.id) || this.props.isNotified('FOLLOWED', ticket.id)) {
					//il faut le recharger
					allTicketsUpdated.push(await getTicket(this.props.firebase, ticket.id));
				} else {
					allTicketsUpdated.push(ticket);
				}

			}
			this.setState({ productsFollowed : allTicketsUpdated });



		}

	}

	async _onBackOnScreen(hasSpoken, ticketToUpdate) {
		
		if (!hasSpoken) {
			return;
		}
		var allTickets = this.state.productsFollowed;
		var allTicketsUpdated = [];
		let i = 0;
		for (const ticket of allTickets) {
			if (ticket.id === ticketToUpdate.getId()) {
				//il faut le recharger
				allTicketsUpdated.push(await getTicket(this.props.firebase, ticketToUpdate.getId()));
				
			} else {
				allTicketsUpdated.push(ticket);
			}
		}
		//await Promise.all(allTicketsUpdated);
		this.setState({ productsFollowed : allTicketsUpdated });
	}

	componentWillUnmount() {
		this.state.scrollAnim.removeAllListeners();
		this.state.offsetAnim.removeAllListeners();
	}

	_onScrollEndDrag = () => {
		this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
	};

	_onMomentumScrollBegin = () => {
		clearTimeout(this._scrollEndTimer);
	};

	_onMomentumScrollEnd = () => {
		const toValue = this._scrollValue > NAVBAR_HEIGHT &&
		this._clampedScrollValue > (NAVBAR_HEIGHT - getConstant('statusBar')) / 2
		? this._offsetValue + NAVBAR_HEIGHT
		: this._offsetValue - NAVBAR_HEIGHT;

	/* Animated.timing(this.state.offsetAnim, {
		toValue,
		duration: 350,
		useNativeDriver: true,
		}).start();*/
	};

	_renderModalCreationProduct() {
		return (
			<Modal
				animationType={'slide'}
				transparent={true}
				visible={this.state.showAddProductModal}
				onRequestClose={() => {
				console.log('Modal has been closed');
				}
			}>
				<View 
					style={{flex:1, backgroundColor:'transparent'}} 
					onStartShouldSetResponder={() => true}
					//onStartShouldSetResponderCapture={() => true}
					//onMoveShouldSetResponderCapture={() => true}
					//onMoveShouldSetResponder={() => true}
					onResponderRelease={(evt) =>{
						let x = evt.nativeEvent.pageX;
						let y = evt.nativeEvent.pageY;
						//si on a clické en dehors du module view cidessous on ferme le modal
						let verifX = x < getConstant('width')*0.05  || x > getConstant('width')*0.95 ? true : false;
						let verifY = y < getConstant('height')*0.2  || y > getConstant('height')*0.8 ? true : false;
						if (verifX || verifY) {
							this.setState({showAddProductModal : false });
							this.setState({ filesToUpload : [] });
						}
					}}
				>
					<View 
						//directionalLockEnabled={true} 
						//contentContainerStyle={{
						style={{
							flexDirection: 'column',
							backgroundColor: 'white',
							borderWidth :3,
							borderColor : setColor(''),
							borderRadius:10,
							width: getConstant('width')*0.9,
							height: getConstant('height')*0.6,
							top:  getConstant('height')*0.2,
							left : getConstant('width')*0.05
						}}
					>
						<View style={{justifyContent : 'space-between'}}>
							<View style={{height : getConstant('height')*0.6 - 60}}>
								<ScrollView >
									<View style={{marginTop : 10, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}>
										<Text style={[setFont('600', 16, 'black', 'Bold'), { textAlign: 'center'}]}>
											{String("MONITORez UN NOUVEAU PRODUIT").toUpperCase()}
										</Text>
									</View>
									<View style={{marginTop : 20,  alignItems:'flex-start', justifyContent: 'flex-start', borderWidth : 0, marginHorizontal : 10}}>
										<Text style={setFont('300', 14, 'black', 'Regular')}>Nom du produit :</Text>
									</View>
									<View style={{height  : 35,  marginTop : 5,  alignItems:'flex-start', justifyContent: 'flex-start', borderWidth : 0, marginHorizontal : 10}}>
										<TextInput  
												style={{width : getConstant('width')*0.8, color: 'black', textAlignVertical:'top', backgroundColor: 'white', padding: 5, borderWidth :1, borderRadius: 2, borderColor : 'lightgray'}}
												multiline={false}
												numberOfLines={1}
												placeholder={'Nom du produit...'}
												onChangeText={(e) => this.setState({ productNameAddProduct : e})}
												value={this.state.productNameAddProduct}
												returnKeyType={'done'}
												//onSubmitEditing={() => Keyboard.dismiss()}
										/>
									</View>
									<View style={{height  : 100,  marginTop : 5,  alignItems:'flex-start', justifyContent: 'flex-start', borderWidth : 0, marginHorizontal : 10}}>
										<TextInput  
												style={{width : getConstant('width')*0.8, height : 100, color: 'black', textAlignVertical:'top', backgroundColor: 'white', padding: 5, borderWidth :1, borderRadius: 2, borderColor : 'lightgray'}}
												multiline={true}
												numberOfLines={3}
												placeholder={'Commentaires...'}
												onChangeText={(e) => this.setState({ productCommentAddProduct : e})}
												value={this.state.productCommentAddProduct}
												returnKeyType={'done'}
												//onSubmitEditing={() => Keyboard.dismiss()}
										/>
									</View>
									{
										this.state.filesToUpload.map((file, index) => {
											return (
												<View 	style={{ flexDirection : 'row', marginTop : 10, marginLeft : 10, marginRight : 10, padding : 5, justifyContent : 'flex-start', alignItems : 'center'}}
														key={file.name}
												>
													<View style={{flex : 0.9}}>
														<Text style={setFont('400',12,'black')} numberOfLines={1}>{file.name}</Text>
													</View>
													<TouchableOpacity style={{flex : 0.1, borderWidth : 0, justifyContent : 'center', alignItems : 'flex-end'}}
															onPress={() => {
																var files = this.state.filesToUpload;
																files.splice(index,1)
																this.setState({ filesToUpload : files });
															}}
													>
														<MaterialIcons name={'cancel'} size={15} style={{color : 'gray'}}/>	
													</TouchableOpacity>
												</View>
											);
										})
									}
				
									<TouchableOpacity 	style={{ flexDirection : 'row', marginTop : 10, marginLeft : 10, marginRight : 10, padding : 5, justifyContent : 'flex-start', alignItems : 'center'}}
														onPress={async() => {
															try {
																var doc = await DocumentPicker.getDocumentAsync();
																if (doc.type === "success") {
																	var files = this.state.filesToUpload;
																	files.push(doc)
																	this.setState({ filesToUpload : files });
																}
																console.log(doc);
															} catch(error) {
								
																console.log(error);
															}
														}}
									>
										<View style={{flex : 0.2}}>
											<MaterialCommunityIcons name={'upload-outline'} size={25} style={{color : 'gray'}}/>	
										</View>
										<View>
											<Text style={setFont('400',12,'black')}>Chargez un {this.state.filesToUpload.length > 0 ? 'autre ' : ''}fichier...</Text>
										</View>
									</TouchableOpacity>
								
								</ScrollView>
							</View>
							<View style={{height : 60, marginTop : 5}}>
								<TouchableOpacity 	style={{marginBottom : 0, marginTop : 0, marginLeft : 10, marginRight : 10, borderWidth: 1, borderColor : setColor('subscribeBlue'), borderRadius : 10, backgroundColor: setColor('subscribeBlue'), padding : 0, justifyContent : 'center', alignItems : 'center'}}
													onPress={() => {
														if (this.state.productNameAddProduct === '') {
															alert("Donnez un nom à votre produit");
															return;
														}
														if (this.state.filesToUpload.length === 0) {
															alert("Chargez au moins un fichier comportant les caractéristiques du produit");
															return;
														}
														this.setState({ showAddProductModal : false, isLoadingCreationTicket : true ,  messageToShow : String("création d'une demande de cotation").toUpperCase()});
									
											
														let productToSend = {}; 
														productToSend['subject'] = this.state.productNameAddProduct;
														productToSend['description'] = this.state.productCommentAddProduct;
														productToSend['type'] = 'Demande Générale';
														productToSend['department'] = 'FIN';
														productToSend['cf_ps_shared'] = false;
														productToSend['cf_followed'] = true;
														
														
														
														let due_byDate = Moment(Date.now()).add(3, 'days').set({"hour": 17, "minute": 30, "second" : 0}).toDate();
														productToSend['due_by'] = Moment.utc(due_byDate).format();
														// console.log(Moment.utc(due_byDate).format());
														let fr_due_byDate = Moment(Date.now()).add(1, 'days').set({"hour": 17, "minute": 15, "second" : 0}).toDate();
														productToSend['fr_due_by'] = Moment.utc(fr_due_byDate).format();
				
														console.log(productToSend);
				
														//"due_by": 2020-05-03T15:30:00.912Z,
														
														createTicket(this.props.firebase, productToSend, this.state.filesToUpload)
														.then((data) => {
															console.log("SUCCES CREATION TICKET");
															var products = this.state.productsFollowed;
															products.unshift(data);
															this.setState({ productsFollowed : products, isLoadingCreationTicket : false ,  messageToShow : ''});
									
															//let t = new CWorkflowTicket(data);
															//this.props.addTicket(t);
															console.log("TICKET DEMANDE GENERALE FOLLOWED AJOUTE");

														})
														.catch(error => {
															alert("Impossible d'envoyer la demande. Veuillez réessayer plus tard.")
															console.log("ERREUR CREATION TICKET: " + error);
															//this.setState({ messageToShow : String('Erreur création demande de prix').toUpperCase()})
															setTimeout(()=> { 
																this.setState({ isLoadingCreationTicket : false, messageToShow : ''});
																Alert.alert(
																	'Erreur',
																	'Impossible de créer la demande',
																	[{text: 'OK', onPress: () => console.log("ok")}],
																	{cancelable: false},
																);
																}, 4000);	
														});
													}}
								>
									<Text style={[setFont('400',14,'white', 'Bold'), {margin : 5}]}>FAIRE ANALYSER</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}


	_renderHeader() {
		const { clampedScroll } = this.state;

		//console.log("RENDER :");
		//console.log(this.state.scrollAnim);

		const navbarTranslate = clampedScroll.interpolate({
		inputRange: [0, NAVBAR_HEIGHT ],
		outputRange: [0, -(NAVBAR_HEIGHT )],
		extrapolate: 'clamp',
		});
		const navbarOpacity = clampedScroll.interpolate({
		inputRange: [0, NAVBAR_HEIGHT ],
		outputRange: [1, 0],
		extrapolate: 'clamp',
		});

		const navbarTop = clampedScroll.interpolate({
		inputRange: [0, NAVBAR_HEIGHT ],
		outputRange: [0, -getConstant('statusBar')],
		extrapolate: 'clamp',
		});
		return (
				<Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
							
							<Animated.View style={{
									display: 'flex',
									backgroundColor: setColor(''),
									//borderRadius: 3,
									borderWidth:0,
									opacity: navbarOpacity,
									height: 45,
									marginTop: 0,
									width: getConstant('width')*1,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
									}}> 
									<View style={{flex: 1, height: 45, borderWidth: 0, width: getConstant('width')*0.925,flexDirection: 'row'}}>   
									<View style={{flex:0.2, borderWidth : 0, height : 45}} />
										<View style={{flex:0.6, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'center'}}>
										<TouchableOpacity onPress={() => {
													console.log("qsjhfjhdfjd");
										}}>
											<Text style={setFont('400', 18, 'white', 'Regular')}>
												Vos produits suivis
											</Text>    
										</TouchableOpacity>
										</View>   

										<TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
											onPress={() => {
											this.props.navigation.setParams({ hideBottomTabBar : true});
											this.setState ({ showModalTitle : !this.state.showModalTitle });

												Animated.parallel([
												Animated.timing(
													this.state.positionLeft,
														{
														toValue: 0,
														duration : 1000,
														easing: Easing.elastic(),
														speed : 1,
														useNativeDriver: true,
														}
												),
												]).start(() => {
												//force le render avec un changement de state dont on se fiche 
												//this.setState ({ showModalTitle : !this.state.showModalTitle });
											});
												
												if (this.inputSearch !== null && this.inputSearch !== undefined) {
												this.inputSearch.focus();
												}
											

											}}>  
											<MaterialIcons
												name='search' 
												size={25} 
												color='white'
											/>
										</TouchableOpacity>
										<TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
															onPress={() => {
															this.setState({ showAddProductModal :true});
															}}> 
											<MaterialCommunityIcons
												name='plus' 
												size={25} 
												style={{color : 'white'}}
											/>
										</TouchableOpacity>
										
									</View>
									<Animated.View style={{flexDirection:'row', top: 0, width: getConstant('width'), backgroundColor: 'white',transform: [{ translateX: this.state.positionLeft }], height: 45}}>
										<View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center', borderWidth : 1}}>
											<TouchableOpacity onPress={() => {
														//this.setState ({ showModalTitle : !this.state.showModalTitle });
														//console.log("SCROLL Y : "+ JSON.stringify(animation.scrollY));
														
														
															Animated.parallel([
															Animated.timing(
																this.state.positionLeft,
																	{
																	toValue: getConstant('width'),
																	duration : 1000,
																	easing: Easing.elastic(),
																	speed : 1,
																	useNativeDriver: true,
																	}
															),
																/*Animated.timing(
																this.state.categoryHeight,
																{
																	toValue: 45,
																	duration : 1000,
																	easing: Easing.elastic(),
																	speed : 1
																}
																)  */
															]).start(() => {
																//force le render avec un changement de state dont on se fiche 
																this.setState ({ showModalTitle : !this.state.showModalTitle });
																this.props.navigation.setParams({ hideBottomTabBar : false});
															});

															if (this.inputSearch !== null && this.inputSearch !== undefined) {
															this.inputSearch.blur();
															}
															this.searchText = '';
															//this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, '');
												}}>  
													<MaterialIcons
														name='arrow-back' 
														size={22} 
														color='lightgray'
														style={{paddingLeft: 20}}
														/>
												</TouchableOpacity>
										</View>
										<View style={{flex: 0.9}}>
											<TextInput 
												style={styles.inputText}
												placeholder={'Filtre ...'}
												placeholderTextColor={'#999'}        
												underlineColorAndroid={'#fff'}
												autoCorrect={false}
												//editable={false}
												onSubmitEditing={() => {
													this.props.navigation.setParams({ hideBottomTabBar : false});
													//this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
												}}
												ref={(inputSearch) => {
													//if (this.inputSearch !== null && this.inputSearch !== undefined) {
													this.inputSearch = inputSearch;
													//inputSearch.focus();
												//  }
												}}
												onChangeText={(text) => this.searchText = text}
												/>
											</View>
									</Animated.View>                    
								</Animated.View>
							</Animated.View>
		);
	}

	render() {



		if (this.state.isErrorLoading) {
			return (
				<SafeAreaView style={{ backgroundColor: setColor('')}}>
					
					<View style={{height: getConstant('height'), width: getConstant('width'), backgroundColor : setColor('background'), justifyContent: 'center', alignItems: 'center'}}>
						{this._renderHeader()}
						<TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', padding : 10, borderRadius : 5, backgroundColor: setColor('subscribeBlue')}}
										onPress={() => {
											this.setState({isErrorLoading : false, isLoading : true} , () => this._loadFromServer());
										}}
						>
								<Text style={setFont('400', 16, 'white', 'Regular')}>Essayer à nouveau</Text>
						</TouchableOpacity>
					</View>
					
				</SafeAreaView>
			);
		}

		if (this.state.isLoading) {
		return (

			<SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
				<View style={{justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white', flex : 1}}>
					{this._renderHeader()}
					<View style={{height : 300, backgroundColor : 'pink'}}>
						<WebView  originWhitelist={['*']} 
							source={{uri: URL_AWS + '/svg?page=robotFlash'}} 
							style={{  width : 150,  marginTop: 0, marginLeft : -50, borderWidth : 0}} 
							scalesPageToFit={true}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							startInLoadingState={true}
							//renderLoading={() => <RobotBlink width={120} height={120} />}
						/>
					</View>
				
				</View>
			</SafeAreaView>
		);
		}

	// <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
		return (

		<SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
		{this._renderModalCreationProduct()}
		<View style={{flex :1, height: getConstant('height'), width: getConstant('width')}} opacity={( this.state.showAddProductModal || this.state.isLoadingCreationTicket ) ? 0.3 : 1}>
	   
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingCreationTicket} text={"Création d'un produit à monitorer"}/>
      



					<AnimatedFlatList
						style={{  backgroundColor: setColor('background')}}
						contentContainerStyle={{alignItems : 'center', marginTop :   NAVBAR_HEIGHT}}
						data={this.state.productsFollowed}
						extraData={this.state.productsFollowed}
						keyExtractor={(item) => item.id+""}
						renderItem={({item, id}) => {
							switch(item.type) {
								case 'Demande Générale' :
									let ticket = new CFollowedTicket(item);
									return (
										<TouchableOpacity style={{marginTop : id === 0 ? 0 : 10}}
															onPress={() => {
																this.props.navigation.navigate('FLTicketDetail', {
																	ticket,
																	onGoBack : (hasSpoken) => this._onBackOnScreen(hasSpoken, ticket)
																});
															}}
										>
											<FollowingDemandeGenerale ticketClass={ticket}  />
										</TouchableOpacity>
									);
									//return <View />;
								case 'Produit structuré' :
									if (item.PRODUCT && item.PRODUCT !== '') {
										let ticket = new CFollowedTicket(item);
										//ticket.setProduct(item.PRODUCT);
										
										return (
												<View style={{marginTop : id === 0 ? 0 : 10}}>
													<FollowingAutocallTemplate ticket={ticket} underlyings={this.underlyings} navigation={this.props.navigation} />
												</View>
										);
									}
									break;
								default : 
									break;
							}
						}}
						horizontal={false}
						scrollEventThrottle={1}
						//extraData={this.state.allNotificationsCount}
						onMomentumScrollBegin={this._onMomentumScrollBegin}
						onMomentumScrollEnd={this._onMomentumScrollEnd}
						onScrollEndDrag={this._onScrollEndDrag}
						onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
						{ useNativeDriver: true },
						)}
						ListFooterComponent={() => {
							return (
								<View style={{height : 150, justifyContent: 'center', alignItems: 'center'}} />
							);
						}}
					/>
			

			{this._renderHeader()}

		</View>
		</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({

navbar: {
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	alignItems: 'center',
	backgroundColor: 'white',
	borderBottomColor: '#dedede',
	borderBottomWidth: 1,
	height: NAVBAR_HEIGHT,
	justifyContent: 'center',
	//paddingTop: getConstant('statusBar),
},
contentContainer: {
	paddingTop: NAVBAR_HEIGHT,
},

row: {
	height: 300,
	width: null,
	marginBottom: 1,
	padding: 16,
	backgroundColor: 'transparent',
},
rowText: {
	color: 'white',
	fontSize: 18,
},
inputText: {
	display: 'flex',
	...ifAndroid({
	marginTop: 9
	}, {
	marginTop: 13
	}),
	marginLeft: 20,
	fontSize: 18,
	color: '#999',
},
});


const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withUser,
  withNavigation
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(FollowingScreen);