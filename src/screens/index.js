import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Container, Text, View, Toast } from 'native-base';
import { connect } from 'react-redux';
import CardFlip from 'react-native-card-flip';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { shuffle } from '../global/functions';
import Modal from 'react-native-modal';
import * as CommonActions from '../actions/CommonActions';
import Moment from 'moment';

const INI_NUM = 16;
const ADD_SCORE = 5;
const DEDUCT_SCORE = 1;

const initialState = {
  modal: false,
  rankModal: false,
  cardArray: [],
  currentScore: 0,
  currentSelect: [],
  currentSelectIndex: [],
  selectedAndDisappearBox: [],
  username: null,
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.flipFlag = false;
    this.state = {
      ...initialState,
    }
  }

  componentDidMount = () => {
    this.initialGame();
  }

  initialGame = () => {
    this.setState({ ...initialState }, () => {
      let cardArray = [];
      for (let i = 1; i <= (INI_NUM / 2); i++) {
        cardArray.push(i);
        cardArray.push(i);
      }
      cardArray = shuffle(cardArray);
      this.setState({ cardArray });
    });
  }

  setColor = (index) => {
    switch (index) {
      case 1:
        return 'rgb(248,150,2)';
      case 2:
        return 'rgb(131,219,19)';
      case 3:
        return 'rgb(124,84,239)';
      case 4:
        return 'rgb(43,138,161)';
      case 5:
        return 'rgb(238,33,14)';
      case 6:
        return 'blue';
      case 7:
        return 'skyblue';
      case 8:
        return 'lightgray';
    }
  }

  flip = (item, index) => {
    if (!this.flipFlag && this.state.currentSelect.length < 1) {
      this.flipFlag = true;
      this['card' + index].flip();
      this.setState({ currentSelect: this.state.currentSelect.concat(item), currentSelectIndex: this.state.currentSelectIndex.concat(index) }, () => setTimeout(() => this.flipFlag = false, 500));
    } else {
      if (!this.flipFlag && index !== this.state.currentSelectIndex[0]) {
        this.flipFlag = true;
        this['card' + index].flip();
        this.setState({ currentSelect: this.state.currentSelect.concat(item), currentSelectIndex: this.state.currentSelectIndex.concat(index) }, () => {
          setTimeout(() => {
            let updateState = { currentSelect: [], currentSelectIndex: [] };
            this.state.currentSelectIndex.map((v) => this['card' + v].flip());
            const selectedItem = this.state.currentSelectIndex.map((v) => v);
            if (+this.state.currentSelect[0] === +this.state.currentSelect[1]) {
              updateState = { ...updateState, selectedAndDisappearBox: this.state.selectedAndDisappearBox.concat(selectedItem) };
              this.countScore(1);
            } else {
              this.countScore(0);
            }
            this.setState(updateState);
            this.flipFlag = false;

            this.checkGameFinish();
          }, 800);
        });
      }
    }
  }

  checkGameFinish = () => {
    if (this.state.selectedAndDisappearBox.length === INI_NUM) {
      this.toogleModal(true);
    }
  }

  // 0 = Lose or 1 = Win
  countScore = (type) => {
    if (type === 0) {
      this.setState({ currentScore: this.state.currentScore - DEDUCT_SCORE });
    } else {
      this.setState({ currentScore: this.state.currentScore + ADD_SCORE });
    }
  }

  submit = () => {
    const { name, currentScore } = this.state;
    if (!name) return Toast.show({ type: "warning", text: 'Please enter username.' });
    const userRecord = {
      username: name,
      scores: currentScore,
      date: Moment().format("YYYY-MM-DD HH:mm:ss"),
    }
    this.props.addUserRecordAction(userRecord);
    this.toogleModal(false);
    this.setState({ ...initialState }, () => this.initialGame());
  }

  resetGameButton = () => {
    this.toogleModal(false);
    setTimeout(() => this.initialGame(), 500);
  }

  toogleModal = (boolean) => {
    this.setState({ modal: boolean });
  }

  toogleRankingModal = (boolean) => {
    this.setState({ rankModal: boolean });
  }

  cleanRankData = () => {
    this.toogleRankingModal(false);
    this.props.cleanUserRecordAction();
  }

  renderRankPopup = () => {
    const withData = this.props.userRecord !== undefined && this.props.userRecord.length > 0 ? true : false;
    const data = withData ? this.props.userRecord.sort((a, b) => b.scores - a.scores) : [];
    return (
      <Modal
        backdropOpacity={0}
        isVisible={this.state.rankModal}
        onBackdropPress={() => this.toogleRankingModal(false)}
      >
        <View style={[styles.modalContainer, styles.shadow]}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Ranking</Text>
          </View>
          <View style={styles.modalContent}>
            <FlatList
              keyExtractor={(item, index) => `${index}`}
              data={data}
              renderItem={this.renderRankItem}
              ListEmptyComponent={this.renderEmptyRank}
            />
          </View>
          {withData ?
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalButton} onPress={() => this.toogleRankingModal(false)}>
                <Text style={[styles.title, { color: "rgb(60,149,251)" }]}>Got it</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { paddingBottom: 0 }]} onPress={this.cleanRankData}>
                <Text style={[styles.title, { color: "rgb(60,149,251)" }]}>Clean All Rank Data</Text>
              </TouchableOpacity>
            </View>
            : null}
        </View>
      </Modal>
    )
  }

  renderEmptyRank = () => {
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.logo} source={require('@images/empty.png')} />
        <Text style={[styles.rankingText, { marginTop: 10 }]}>No Rank Data</Text>
      </View>
    )
  }

  renderRankItem = ({ item, index }) => {
    let username = item.username ? item.username : '';
    let scores = item.scores ? item.scores : 0;
    let date = item.date ? item.date : '';

    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.rankingText}>Name:  {username}</Text>
        <Text style={styles.rankingText}>Score:  {scores}</Text>
        <Text style={styles.rankingText}>Date:  {date}</Text>
      </View>
    )
  }

  renderFinishGamePopup = () => {
    return (
      <Modal
        backdropOpacity={0}
        isVisible={this.state.modal}
      >
        <View style={[styles.modalContainer, styles.shadow]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.title, { color: 'green' }]}>Congratulation !!!</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.title}>You win {this.state.currentScore} scores</Text>
            <TextInput
              style={[styles.title, styles.textInput]}
              placeholder="Username"
              textAlign='center'
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name !== undefined ? this.state.name : ''}
            />
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalButton} onPress={() => this.submit()}>
              <Text style={[styles.title, { color: "rgb(60,149,251)" }]}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => this.toogleModal(false)}>
              <Text style={[styles.title, { color: "rgb(60,149,251)" }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { paddingBottom: 0 }]} onPress={() => this.resetGameButton()}>
              <Text style={[styles.title, { color: "rgb(60,149,251)" }]}>Reset a Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderItem = ({ item, index }) => {
    const cardColor = this.setColor(item);
    const disappear = this.state.selectedAndDisappearBox.length > 0 && this.state.selectedAndDisappearBox.includes(index) ? true : false;
    return (
      <View style={styles.cardRow}>
        <CardFlip style={[styles.cardContainer, { opacity: disappear ? 0 : 1 }]} ref={(card) => this['card' + index] = card} >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.card, styles.card1]}
            onPress={() => disappear ? null : this.flip(item, index)}>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.card, styles.card2, { backgroundColor: cardColor }]}
            onPress={() => disappear ? null : this.flip(item, index)}>
          </TouchableOpacity>
        </CardFlip>
      </View >
    )
  }

  render() {
    let findHighestScore = 0;
    if (this.props.userRecord !== undefined && this.props.userRecord.length > 0) {
      findHighestScore = this.props.userRecord.sort((a, b) => b.scores - a.scores)[0].scores;
    }
    return (
      <Container style={styles.container}>
        {this.renderFinishGamePopup()}
        {this.renderRankPopup()}
        <View style={styles.header}>
          <View style={[styles.row, { flex: 1 }]}>
            <Image style={styles.logo} source={{ uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0428cd5e-b1ca-4c7c-8d6a-0b263465bfe0/d4hdgi8-f17ea8f8-af72-42aa-a38e-c806e3f2bb02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMDQyOGNkNWUtYjFjYS00YzdjLThkNmEtMGIyNjM0NjViZmUwXC9kNGhkZ2k4LWYxN2VhOGY4LWFmNzItNDJhYS1hMzhlLWM4MDZlM2YyYmIwMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.hG2EsIxbsShNtgc8dWrrsEiSbM4cQz3lyBaGI5S9OFM" }} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>{this.state.currentScore}</Text>
            <Text style={styles.text}>Scores</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => this.toogleRankingModal(true)}>
            <Text style={styles.title}>{findHighestScore || 0}</Text>
            <Text style={styles.text}>Highest Score</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          columnWrapperStyle={styles.cardFlatlist}
          keyExtractor={(item, index) => `${index}`}
          data={this.state.cardArray}
          renderItem={this.renderItem}
          numColumns={4}
          extraData={this.state.currentSelect}
        />

        <TouchableOpacity style={styles.bottomSection} onPress={this.initialGame}>
          <Text textAlign="center" style={styles.text}>Reset Game</Text>
        </TouchableOpacity>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  logo: {
    width: hp(7.5),
    height: hp(7.5),
    resizeMode: 'contain',
  },
  row: { flex: 1.5 },

  // Card
  cardFlatlist: {
    flex: 1,
    flexDirection: 'row'
  },
  cardRow: {
    width: '22.5%',
    height: 100,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE474C',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },

  card1: {
    backgroundColor: 'gray',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  //Shadow 
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },

  // Modal
  modalContainer: {
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20
  },
  modalHeader: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(240,240,240,1)',
  },
  modalContent: {
    margin: 20,
  },
  modalFooter: {

  },
  modalButton: {
    borderTopWidth: 1,
    borderColor: 'rgba(240,240,240,1)',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Text Adjustment
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4f4f4f'
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(127,127,127,1)'
  },
  rankingText: {
    fontSize: 17,
    color: '#4f4f4f'
  },
  textInput: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderColor: 'lightgray',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  // Other
  bottomSection: {
    width: '100%',
    paddingVertical: 20
  },

  // Emtpy View
  emptyContainer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});


const mapStateToProps = (state) => ({
  userRecord: state.common.userRecord,
});

const mapDispatchToProps = (dispatch, props) => ({
  addUserRecordAction: (params) => dispatch(CommonActions.addUserRecordAction(params)),
  cleanUserRecordAction: () => dispatch(CommonActions.cleanUserRecordAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);